import { Router } from 'express';
import userController from '../controllers/auth';

export const authRouter = Router()
  .post('/register', userController.registerUser)
  .post('/login', userController.authorizeUser)
