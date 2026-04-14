import 'dotenv/config';
import 'reflect-metadata';
import { AppDataSource } from './config/database';
import app from './app';
import http from 'http';
import { createConnection } from './socket';

const PORT = process.env.PORT || 3000;
export const server = http.createServer(app);
const io = createConnection(server);

export const activeSockets = new Map();

AppDataSource.initialize()
  .then(() => {
    server.listen(PORT, () => {
      // if (err) {
      //   console.log('>err', err);
      //   return;
      // }
      console.log(`Server running on port ${PORT}`);
    });

    io.on('connection', (socket) => {
      activeSockets.set(socket.handshake.query.userId, socket);

      socket.on('disconnect', () => {
        activeSockets.delete(socket.handshake.query.userId)
      });
    });
  })
  .catch((err: unknown) => console.log(err));
