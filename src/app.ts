import cors from 'cors';
import express, { Application } from 'express';
import { authRouter } from './routes/auth';
import { userRouter } from './routes/user'
import cookieParser from 'cookie-parser';

const app: Application = express();
// todo
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use('/', authRouter);
app.use('/user', userRouter);

app.use((err, req, res, next) => {
  res.status(err.status || 500)
    .json({ message: err.message || 'Something went wrong' });
});

export default app;
