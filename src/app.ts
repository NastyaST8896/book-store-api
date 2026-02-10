import cors from 'cors';
import express, { Application, ErrorRequestHandler } from 'express';
import { authRouter } from './routes/auth';
import cookieParser from 'cookie-parser';

const app: Application = express();

app.use(cors({credentials: true, origin: 'http://localhost:5173'}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', authRouter);
// app.use('/users', userRouter);

app.use((err, req, res, next) => {
  res.status(err.status || 500)
    .json({ message: err.message || 'Something went wrong' });
});

export default app;
