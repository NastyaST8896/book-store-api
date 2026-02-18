import { Router } from 'express';
import userController from '../controllers/user'
import { authenticateToken } from '../utils/helpers';
import multer from 'multer';
import path from 'node:path';

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {

  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({storage: storage, fileFilter: fileFilter});



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