import 'dotenv/config';
import 'reflect-metadata';
import { AppDataSource } from './config/database';
import app from './app';
import http from 'http';
import { ConnectionManager } from './socket';
import { commentsRepository } from './db/repositories/repository';

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

    io.on('connection', async (socket) => {
      if (socket.handshake.query.userId) {
        ConnectionManager.setActiveSocket(socket.handshake.query.userId, socket)

        const booksSubscription = await commentsRepository
          .createQueryBuilder("comments")
          .select("comments.bookId")
          .where(
            "comments.userId = :userId",
            { userId: socket.handshake.query.userId }
          )
          .distinct(true)
          .getRawMany();

        booksSubscription.forEach((book) => {
          socket.join(`${book.comments_bookId} book room`);
        })
      }

      socket.on('disconnect', () => {
        if (socket.handshake.query.userId) {
          ConnectionManager.deleteActiveSocket(socket.handshake.query.userId)
        }
      });
    });
  })
  .catch((err: unknown) => console.log(err));
