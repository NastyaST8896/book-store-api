import express, { Application, ErrorRequestHandler } from 'express';
import { authRouter } from './routes/auth';

const app: Application = express();


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  return next();
});
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/auth', authRouter);
// app.use('/users', userRouter);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'Something went wrong' });
});

export default app;
