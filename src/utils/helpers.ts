import { userRepository } from '../db/repositories/repository';
import { AppError } from './app-error';
import jwt from 'jsonwebtoken';
import { AppRequest } from './types';
import { NextFunction, Response } from 'express';

type JWTPayload = {
  id: number,
  email: string
}

export const checkIsEmailAvailable = async (email: string) => {
  const user = await userRepository.findOne({ where: { email } });

  if (user) {
    throw new AppError('This email has already taken', 400);
  }
};

export const jwtVerify = (token: string) => {
  if (!token) {
    throw new AppError('Access token missing', 401);
  }

  return new Promise<JWTPayload>((resolve, reject) => {
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded: JWTPayload) => {
      if (err) {
        reject(new AppError('Invalid or expired token', 401));
      }

      resolve(decoded);
    });
  });
};

export const authenticateToken = async (req: AppRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  req.user = await jwtVerify(token);

  next();
};