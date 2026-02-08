import { NextFunction, Response } from 'express';
import { User } from '../db/entities/user';
import { userRepository } from '../db/repositories/repository';
import bcrypt from 'bcryptjs';
import { AppRequest } from '../utils/types';
import { validateEmail, validatePassword } from '../utils/validations';
import {
  checkIsEmailAvailable,
} from '../utils/helpers';
import { AppError } from '../utils/app-error';
import jwt from 'jsonwebtoken';


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

  const secret = process.env.JWT_SECRET;

  const accessToken = jwt.sign({ id: user.id, email: user.email }, secret, {
    expiresIn: '15m'
  });

  return res.status(200).json({ user: { id: user.id, email: user.email }, accessToken });
};

export default {
  registerUser,
  authorizeUser,
};