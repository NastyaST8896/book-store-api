import { Router } from 'express';
import userController from '../controllers/auth';

export const authRouter = Router()
  .post('/register', userController.registerUser)
  .post('/login', userController.authorizeUser)
  .post('/refresh', userController.refreshTokenUser)
  .get('/check-auth', userController.checkAuthUser)
  .post('/change', userController.changeUser)

