import { NextFunction, Response } from 'express';
import { User } from '../db/entities/user';
import { userRepository } from '../db/repositories/repository';
import bcrypt from 'bcryptjs';
import { AppRequest } from '../types/utils';
import { validateEmail, validatePassword } from '../utils/validations';
import { checkIsEmailAvailable } from '../utils/helpers';


type UserType = {
  id?: number,
  fullName?: string,
  email: string,
  password: string,
}





const registerUser = async (req: AppRequest<UserType>, res: Response, next: NextFunction) => {
  // try {
  const { email, password } = req.body;

  validatePassword(password);
  validateEmail(email);
  await checkIsEmailAvailable(email);
  const user = new User();
  user.email = email;

  user.password = await bcrypt.hash(password, 10);

  const d = await userRepository.manager.save(user);
  console.log('d', d);

  return res.status(201).json(user);

  // if (error.message.includes('unique')) {
  //   res.status(400).json({ message: 'User already exists' });
  //   return;
  // }



  // } catch (err) {
  //   next(err);
  // res.status(500).json({ message: err.message });
  // }
};

export default {
  registerUser,
};