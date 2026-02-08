import { userRepository } from '../db/repositories/repository';
import { AppError } from './app-error';

export const checkIsEmailAvailable = async (email: string) => {
  const user = await userRepository.findOne({ where: { email } });
  if (user) {
    throw new AppError('This email has already taken', 400);
  }
}