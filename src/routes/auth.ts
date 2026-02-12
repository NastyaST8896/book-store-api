import { Router } from 'express';
import userController from '../controllers/auth';
import { authenticateToken } from '../utils/helpers';

export const authRouter = Router()
  .post('/register', userController.registerUser)
  .post('/login', userController.authorizeUser)
  .post('/refresh', userController.refreshTokenUser)
  .get('/check-auth', authenticateToken, userController.checkAuthUser)
  .post('/change', authenticateToken, userController.changeUser);

