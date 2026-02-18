import { Router } from 'express';
import authController from '../controllers/auth';
import { authenticateToken } from '../utils/helpers';

export const authRouter = Router()
  .post('/register', authController.registerUser)
  .post('/login', authController.authorizeUser)
  .post('/refresh', authController.refreshTokenUser)
  .get('/check-auth', authenticateToken, authController.checkAuthUser)
  