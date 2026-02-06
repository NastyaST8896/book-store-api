import { userRepository } from '../db/repositories/repository';
import { AppError } from './app-error';

export const checkIsEmailAvailable = async (email: string) => {
  const result = await userRepository.findOne({ where: { email }});
  if (result) {
    throw new AppError('This email has already taken', 400);
  }
}

export const checkIsUserEmailExist = async (email: string) => {
  const result = await userRepository.findOne({ where: { email }});
  if (!result) {
    throw new AppError('User not found', 400);
  }
}

export const checkIsPasswordsMatch = async (IsPasswordsMatch: boolean) => {
  if(!IsPasswordsMatch) {
    throw new AppError(`Passwords don't match`, 400);
  }
}