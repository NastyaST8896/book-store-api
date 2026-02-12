import isEmail from 'validator/lib/isEmail';
import { AppError } from './app-error';

export const validatePassword = (password: string) => {
  const hasLowercase = /[a-zа-яё]/;
  const hasUppercase = /[A-ZА-ЯЁ]/;
  const hasDigit = /\d/;

  if (password.trim().length < 8) {
    throw new AppError('Password must be at least 8 characters long', 400);
  }

  if (!hasLowercase.test(password)) {
    throw new AppError('Password must contain at least one lowercase letter', 400);
  }

  if (!hasUppercase.test(password)) {
    throw new AppError('Password must contain at least one uppercase letter', 400);
  }

  if (!hasDigit.test(password)) {
    throw new AppError('Password must contain at least one digit', 400);
  }
};

export const validateEmail = (email: string) => {
  if (!email) {
    throw new AppError('Email address is required', 400);
  }

  if (!isEmail(email)) {
    throw new AppError('Incorrect email address', 400);
  }
};