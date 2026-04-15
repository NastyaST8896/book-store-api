import 'dotenv/config';
import 'reflect-metadata';
import { AppDataSource } from './config/database';
import app from './app';
import http from 'http';
import { ConnectionManager } from './socket';

const PORT = process.env.PORT || 3000;
export const server = http.createServer(app);
export const io = ConnectionManager.createConnection(server);

AppDataSource.initialize()
  .then(() => {
    server.listen(PORT, () => {
      // if (err) {
      //   console.log('>err', err);
      //   return;
      // }
      console.log(`Server running on port ${PORT}`);
    });

    io.on('connection', async(socket) => {
      ConnectionManager.setActiveSocket(socket.handshake.query.userId, socket);

      socket.on('disconnect', () => {
        ConnectionManager.deleteActiveSocket(socket.handshake.query.userId)
      });
    });
  })
  .catch((err: unknown) => console.log(err));
