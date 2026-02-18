import { Response } from 'express';
import { User } from '../db/entities/user';
import {
  refreshTokenRepository,
  userRepository
} from '../db/repositories/repository';
import bcrypt from 'bcryptjs';
import { AppRequest } from '../utils/types';
import { validateEmail, validatePassword } from '../utils/validations';
import { checkIsEmailAvailable } from '../utils/helpers';
import { AppError } from '../utils/app-error';



const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

type UserType = {
  id?: number,
  fullName?: string,
  email: string,
  password: string,
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

  res.cookie(
    'accessToken',
    accessToken,
    {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    }
  )

  const refreshToken = refreshTokenRepository.create({
    ipAddress: req.ip,
    userId: user.id,
    expiresAt: new Date(Date.now() + SEVEN_DAYS)
  });
  await refreshTokenRepository.save(refreshToken);

  return res.status(200).json({
    user: { fullName: user.fullName, email: user.email },
    accessToken,
    refreshToken: refreshToken.token,
  });
};

const refreshTokenUser = async (
  req: AppRequest<{ refreshToken: string }>,
  res: Response
) => {
  const token = req.body.refreshToken;

  if (!token) {
    throw new AppError('Refresh token missing', 403);
  }

  const dbToken = await refreshTokenRepository.findOne({
    where: { token },
    relations: { user: true }
  });

  if (dbToken.expiresAt <= new Date()) {
    throw new AppError('Refresh token expired', 403);
  }

  const accessToken = dbToken.user.generateToken();

  const refreshToken = refreshTokenRepository.create({
    ipAddress: req.ip,
    userId: dbToken.user.id,
    expiresAt: new Date(Date.now() + SEVEN_DAYS)
  });
  await refreshTokenRepository.save(refreshToken);

  return res.status(200).json({
    accessToken,
    refreshToken: refreshToken.token
  });
};

const checkAuthUser = async (req: AppRequest, res: Response) => {
  const user = await userRepository.findOne({ where: { id: req.user.id } });

  if (!user) {
    throw new AppError('Something went wrong', 500);
  }

  res.status(200).json({ fullName: user.fullName, email: user.email });
};

export default {
  registerUser,
  authorizeUser,
  refreshTokenUser,
  checkAuthUser,
};