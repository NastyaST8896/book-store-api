import { Router } from 'express';
import userController from '../controllers/auth';
import { authenticateToken } from '../utils/helpers';
import multer from 'multer';


const upload = multer({ dest: 'uploads/' });

export const authRouter = Router()
  .post('/register', userController.registerUser)
  .post('/login', userController.authorizeUser)
  .post('/refresh', userController.refreshTokenUser)
  .get('/check-auth', authenticateToken, userController.checkAuthUser)
  .post('/change-name', authenticateToken, userController.changeUserName)
  .post(
    '/change-password', 
    authenticateToken, 
    userController.changeUserPassword
  )
  .post('/change-avatar', authenticateToken, upload.single('file'), userController.changeUserAvatar);