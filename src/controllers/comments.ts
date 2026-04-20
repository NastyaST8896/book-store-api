import { AppRequestHandler } from "../utils/types";
import { Comments } from "../db/entities/comments";
import {
  bookRepository,
  commentNotificationsRepository,
  commentsRepository,
  userRepository
} from "../db/repositories/repository";
import { io } from "../server";
import { ConnectionManager } from "../socket";
import { CommentNotifications } from "../db/entities/comment-notifications";
import { AppError } from "../utils/app-error";

const addBookComment: AppRequestHandler = async (req, res) => {
  const newComment = new Comments();

  const eventsKeyList = {
    NEW_COMMENT: 'new comment',
    NEW_COMMENT_TOAST: 'new comment toast',
    BOOK_COMMENT_NOTIFICATION: 'book comment notification'
  }

  const activeSockets = ConnectionManager.getActiveSocket();

  if (!req.user) {
    throw new AppError('User not found', 404);
  }

  newComment.bookId = req.body.bookId;
  newComment.userId = req.user.id;
  newComment.description = req.body.text;

  const commentAuthor = await userRepository.findOne({
    relations: { media: true },
    where: { id: req.user.id }
  });

  if (!commentAuthor) {
    throw new AppError('User not found', 404);
  }

  const currentBook = await bookRepository.findOne({
    where: { id: req.body.bookId }
  });

  if (!currentBook) {
    throw new AppError('Book not found', 404);
  }

  await commentsRepository.save(newComment);

  const socket = ConnectionManager.getSocketByUserId(String(req.user.id));
  socket.join(`${req.body.bookId} book room`);

  const usersSubscribedToBookNotification = await commentsRepository
    .createQueryBuilder("comments")
    .select("comments.userId")
    .where("comments.bookId = :bookId", { bookId: req.body.bookId })
    .andWhere("comments.userId <> :userId", { userId: req.user.id })
    .distinct(true)
    .getRawMany();

  if (usersSubscribedToBookNotification.length) {

    const usersId = usersSubscribedToBookNotification.map((userId) => {
      return userId.comments_userId;
    })

    const comment = await commentsRepository.findOne({
      where: {
        description: req.body.text,
      },
      order: {
        createAt: 'DESC',
      },
    });

    if (!comment) {
      throw new AppError('Comment is missing', 400);
    };

    usersId.forEach((user) => {
      const commentNotification = new CommentNotifications();
      commentNotification.userId = user;
      commentNotification.commentId = comment.id;
      commentNotification.meta = {
        type: 'bookComment',
        bookId: req.body.bookId,
        commentAuthorId: req.user.id,
      }
      commentNotificationsRepository.save(commentNotification);
    })

    if (activeSockets) {
      const socket = ConnectionManager.getSocketByUserId(String(req.user.id));
      socket.to(`${req.body.bookId} book room`).emit(
        eventsKeyList.BOOK_COMMENT_NOTIFICATION, {
        id: comment.id,
        name: commentAuthor.fullName,
        date: comment.createAt,
        bookTitle: currentBook.title,
        text: comment.description,
        img: `${process.env.BASE_URL + commentAuthor.media.filePath}`,
        bookId: currentBook.id,
      });
    }

    // socket.broadcast.emit(
    //   eventsKeyList.NEW_COMMENT_TOAST,
    //   { title: currentBook.title, id: currentBook.id }
    // );
  }


  io.emit(eventsKeyList.NEW_COMMENT);

  return res.status(200).json({ data: { status: 'ok' } });
};

const getBookComments: AppRequestHandler = async (req, res) => {
  const bookId = +req.params.id

  const comments = await commentsRepository.find({
    relations: {
      user: {
        media: true,
      }
    },
    where: {
      bookId
    },
    order: {
      createAt: 'asc',
    },
  });

  let result = []

  if (comments) {
    result = comments.map((comment) => {
      return {
        id: comment.id,
        name: comment.user.fullName,
        date: comment.createAt,
        text: comment.description,
        img: `${process.env.BASE_URL + comment.user.media.filePath}`,
      }
    })
  }

  res.status(200).json({
    data: {
      comments: result,
    }
  });
};

export default {
  addBookComment,
  getBookComments
};