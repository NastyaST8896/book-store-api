import 'dotenv/config';
import "reflect-metadata";
import { AppDataSource } from "./config/database";
import express, { Application, ErrorRequestHandler } from 'express';
import { userRouter} from './routes/user-routes';

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/register', userRouter);

const t: ErrorRequestHandler =(err, req, res, next) => {

}

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'Something went wrong' });
});

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, (err) => {
      if (err) {
        console.log('>err', err);
      }
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err: unknown) => console.log(err));