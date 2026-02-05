import { NextFunction, Response } from 'express';
import { User } from '../db/entities/user';
import { userRepository } from '../repositories/repository';
import bcrypt from 'bcryptjs';
import { AppRequest } from '../types/utils';
import isEmail from 'validator/lib/isEmail';
import { AppError } from '../utils/app-error';

type UserType = {
  id?: number,
  fullName?: string,
  email: string,
  password: string,
}

const validatePassword = (password: string) => {
  const hasLowercase = /[a-zа-яё]/;
  const hasUppercase = /[A-ZА-ЯЁ]/;
  const hasDigit = /\d/;

  if (password.trim().length < 8) {
    throw new AppError('Password must be at least 8 characters long', 400);
  }

  if(!hasLowercase.test(password)) {
    throw new AppError('Password must contain at least one lowercase letter', 400);
  }

  if(!hasUppercase.test(password)) {
    throw new AppError('Password must contain at least one uppercase letter', 400);
  }

  if(!hasDigit.test(password)) {
    throw new AppError('Password must contain at least one digit', 400);
  }
};

const validateEmail = (email: string) => {
  if (!email) {
    throw new AppError('Email address is required', 400);
  }

  if (!isEmail(email)) {
    throw new AppError('Incorrect email address', 400);
  }
}

const createUser = async (req: AppRequest<UserType>, res: Response, next: NextFunction): Promise<void> => {
  // try {
  const { email, password } = req.body;

  validatePassword(password);
  validateEmail(email);

  const user = new User();
  user.email = email;

  user.password = await bcrypt.hash(password, 10);
  try {
    await userRepository.manager.save(user);

    res.status(200).json(user);
  } catch (error) {
    if (error.message.includes('unique')) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    next(error);
  }


  // } catch (err) {
  //   next(err);
  // res.status(500).json({ message: err.message });
  // }
};

export default {
  createUser,
};