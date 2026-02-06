import { userRepository } from '../db/repositories/repository';
import { AppError } from './app-error';

export const checkIsEmailAvailable = async (email: string) => {
  const result = await userRepository.findOne({ where: { email }});
  if (result) {
    throw new AppError('This email has already taken', 400);
  }
}