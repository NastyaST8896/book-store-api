import { Router } from 'express';
import userController from '../controllers/user'
import { authenticateToken } from '../utils/helpers';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

export const userRouter = Router()
  .get('/user-info', authenticateToken, userController.getUser)
  .post('/change-name', authenticateToken, userController.changeUserName)
  .post(
    '/change-password',
    authenticateToken,
    userController.changeUserPassword
  )
  .post(
    '/change-avatar',
    authenticateToken,
    upload.single('file'),
    userController.changeUserAvatar
  );