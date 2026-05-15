import 'dotenv/config';
import 'reflect-metadata';
import { AppDataSource } from './config/database';
import app from './app';
import http from 'http';
import { ConnectionManager } from './socket';
import { commentsRepository, userRepository } from './db/repositories/repository';
import { jwtVerify } from './utils/helpers';
import { AppError } from './utils/app-error';

const PORT = process.env.PORT || 3000;
export const server = http.createServer(app);
export const io = ConnectionManager.createConnection(server);

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    const decoded = await jwtVerify(token);

    const user = await userRepository.findOne({
      where: { id: decoded.id }
    });

    if (!user) {
      throw new AppError('Something went wrong', 500);
    }

    socket.data.user = user;

    next();
  } catch (error) {
    console.error('Authentication error', error);
    next(new Error('Authentication error'));
  }
})

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
        ConnectionManager.setActiveSocket(socket.data.user.id, socket)

        const booksSubscription = await commentsRepository
          .createQueryBuilder("comments")
          .select("comments.bookId")
          .where(
            "comments.userId = :userId",
            { userId: socket.data.user.id }
          )
          .distinct(true)
          .getRawMany();

        booksSubscription.forEach((book) => {
          socket.join(`${book.comments_bookId} book room`);
        })

      socket.on('disconnect', () => {
          ConnectionManager.deleteActiveSocket(socket.data.user.id);
      });
    });
  })
  .catch((err: unknown) => console.log(err));
