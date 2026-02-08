import 'dotenv/config';
import "reflect-metadata";
import { AppDataSource } from "./config/database";
import app from './app';

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, (err) => {
      if (err) {
        console.log('>err', err);
        return;
      }
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err: unknown) => console.log(err));