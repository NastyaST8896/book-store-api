import { userRepository } from '../db/repositories/repository';
import { AppError } from './app-error';
import jwt from 'jsonwebtoken';

type JWTPayload = {
  id: number,
  email: string
}

export const checkIsEmailAvailable = async (email: string) => {
  const user = await userRepository.findOne({ where: { email } });
  if (user) {
    throw new AppError('This email has already taken', 400);
  }
}

export const jwtVerify = (token: string) => {
  return new Promise<JWTPayload>((resolve, reject) => {
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded: JWTPayload) => {
      if (err) {
        reject(new AppError('Invalid or expired token', 401));
      }

      resolve(decoded);
    });
  });
};