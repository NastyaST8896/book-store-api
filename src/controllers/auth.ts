import { Response } from 'express';
import { User } from '../db/entities/user';
import {
  refreshTokenRepository,
  userRepository
} from '../db/repositories/repository';
import bcrypt from 'bcryptjs';
import { AppRequest } from '../utils/types';
import { validateEmail, validatePassword } from '../utils/validations';
import {
  checkIsEmailAvailable,
} from '../utils/helpers';
import { AppError } from '../utils/app-error';
import jwt from 'jsonwebtoken';


const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

type UserType = {
  id?: number,
  fullName?: string,
  email: string,
  password: string,
}

type JWTPayload = {
  id: number,
  email: string
}

const registerUser = async (req: AppRequest<UserType>, res: Response) => {
  const { email, password } = req.body;

  validatePassword(password);
  validateEmail(email);
  await checkIsEmailAvailable(email);
  const user = new User();
  user.email = email;

  user.password = await bcrypt.hash(password, 10);

  await userRepository.manager.save(user);

  return res.status(201).json(user);
};

const authorizeUser = async (req: AppRequest<UserType>, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email or password is missing', 400);
  }

  const user = await userRepository.findOne({ where: { email } });

  if (!user) {
    throw new AppError('Incorrect password or email', 400);
  }

  const isPasswordsMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordsMatch) {
    throw new AppError('Incorrect password or email', 400);
  }

  const accessToken = user.generateToken();

  const refreshToken = refreshTokenRepository.create({
    ipAddress: req.ip,
    userId: user.id,
    expiresAt: new Date(Date.now() + SEVEN_DAYS)
  });
  await refreshTokenRepository.save(refreshToken);

  return res.status(200).json({
    user: { id: user.id, email: user.email },
    accessToken,
    refreshToken,
  });
};

const refreshTokenUser = async (req, res: Response) => {
  const token = req.refreshToken;

  if (!token) {
    throw new AppError('Refresh token missing', 403)
  }

  const dbToken = await refreshTokenRepository.findOne({ where: { token } });

  if (dbToken.expiresAt <= new Date(Date.now())) {
    throw new AppError('Refresh token expired', 403)
  }

  const accessToken = dbToken.user.generateToken();

  return res.status(200).json({token: accessToken });
};

const getUser = async (req, res:Response) => {
  const accessToken = req.body.accessToken;

  console.log(accessToken)

  if (!accessToken) {
    throw new AppError('Access token missing', 401);
  }
// process.env.JWT_ACCESS_SECRET

  // const data = JSON.parse(jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET) as string);
  const data = jwt.verify(
    accessToken,
    process.env.JWT_ACCESS_SECRET
  ) as jwt.JwtPayload;
  console.log('data', data);
  // const accessTokenParts = accessToken.split('.');
  // const tokenPayloadPart = JSON.parse(atob(accessTokenParts[1]));
  // const email = tokenPayloadPart.email;
  const { email } = data;
   console.log(email);

  const user = await userRepository.findOne({ where: { email } });

  return res.status(200).json({ user });
}

export default {
  registerUser,
  authorizeUser,
  refreshTokenUser,
  getUser
};