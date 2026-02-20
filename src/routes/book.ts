import multer from 'multer';
import path from 'node:path';
import { Router } from 'express';
import bookController from '../controllers/book';
import schemaValidator from '../schemaValidator';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  }
});

const fileFilter = (req, file, cb) => {

  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

export const bookRouter = Router()
  .get('/', schemaValidator("/books/get-books"), bookController.getBooks)
  .post('/create-book', upload.single('cover'), bookController.createBook);