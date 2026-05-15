import { In } from "typeorm";
import { commentNotificationsRepository } from "../db/repositories/repository";
import { AppError } from "../utils/app-error";
import { AppRequestHandler } from "../utils/types";

const getCommentBooksNotifications: AppRequestHandler = async (req, res) => {
  if (!req.user) {
    throw new AppError('User not found', 404);
  }
  const notificationId = req.validatedQuery?.notificationId || null;
  const limit = req.validatedQuery?.limit || 5;
  let comments;

  let query = commentNotificationsRepository
    .createQueryBuilder('commentNotifications')
    .leftJoinAndSelect('commentNotifications.comment', 'comment')
    .leftJoinAndSelect('comment.book', 'book')
    .leftJoinAndSelect('comment.user', 'user')
    .leftJoinAndSelect('user.media', 'media')
    .where("commentNotifications.userId = :userId", { userId: req.user.id })
    .orderBy("commentNotifications.createAt", "DESC")
    .take(limit)

  if (notificationId === null) {
    comments = await query.getMany();
  } else {
    query = query.andWhere("commentNotifications.id < :id", { id: notificationId });
    comments = await query.getMany();
  }

  const total = await commentNotificationsRepository
    .createQueryBuilder('commentNotifications')
    .where("commentNotifications.userId = :userId", { userId: req.user.id })
    .getCount();

  const notViewed = await commentNotificationsRepository
    .createQueryBuilder('commentNotifications')
    .where("commentNotifications.userId = :userId", { userId: req.user.id })
    .andWhere("commentNotifications.isRead = :isRead", { isRead: false })
    .getCount();

  const result = comments.map((comment) => {
    return (
      {
        id: comment.commentId,
        notificationId: comment.id,
        name: comment.comment.user.fullName,
        date: comment.createAt,
        bookTitle: comment.comment.book.title,
        text: comment.comment.description,
        img: `${process.env.BASE_URL}${comment.comment.user.media?.filePath}`,
        bookId: comment.meta.bookId,
        isRead: comment.isRead,
      }
    )
  });

  res.status(200).json({
    data: {
      booksNotifications: result,
    },
    meta: {
      pagination: {
        limit: limit,
        totalAmount: total || 0,
        notViewedAmount: notViewed || 0,
      }
    }
  });
};

const getCommentBookNotification: AppRequestHandler = async (req, res) => {
  if (!req.user) {
    throw new AppError('User not found', 404);
  }

  const commentId = req.validatedQuery?.commentId || null;

  const comment = await commentNotificationsRepository
    .createQueryBuilder('commentNotifications')
    .leftJoinAndSelect('commentNotifications.comment', 'comment')
    .leftJoinAndSelect('comment.book', 'book')
    .leftJoinAndSelect('comment.user', 'user')
    .leftJoinAndSelect('user.media', 'media')
    .where("commentNotifications.userId = :userId", { userId: req.user.id })
    .andWhere("commentNotifications.isRead = :isRead", { isRead: false })
    .andWhere("comment.id = :commentId", { commentId: commentId })
    .orderBy("commentNotifications.createAt", "DESC")
    .getOne();

  res.status(200).json({
    data: {
      bookNotification: {
        id: comment?.commentId,
        notificationId: comment?.id,
        name: comment?.comment.user.fullName,
        date: comment?.createAt,
        bookTitle: comment?.comment.book.title,
        text: comment?.comment.description,
        img: `${process.env.BASE_URL}${comment?.comment.user.media?.filePath}`,
        bookId: comment?.meta.bookId,
        isRead: comment?.isRead,
      },
    }
  });
}

const patchNotificationsIsRead: AppRequestHandler = async (req, res) => {
  if (!req.user) {
    throw new AppError('User not found', 404);
  }

  const notificationsId = req.body.notificationsId;

  await commentNotificationsRepository
    .update(
      { id: In(notificationsId) },
      { isRead: true }
    )

  res.status(200).json({ message: 'ok' });
};

const getNotViewedBookCommentNotifications: AppRequestHandler = async (req, res) => {
  if (!req.user) {
    throw new AppError('User not found', 404);
  }

  let notifications;

  const notificationId = req.validatedQuery?.notificationId || null;

  const limit = req.validatedQuery?.limit || 5;

  let query = commentNotificationsRepository
    .createQueryBuilder('commentNotifications')
    .leftJoinAndSelect('commentNotifications.comment', 'comment')
    .leftJoinAndSelect('comment.book', 'book')
    .leftJoinAndSelect('comment.user', 'user')
    .leftJoinAndSelect('user.media', 'media')
    .where("commentNotifications.userId = :userId", { userId: req.user.id })
    .andWhere("commentNotifications.isRead = :isRead", { isRead: false })
    .orderBy("commentNotifications.createAt", "DESC")
    .take(limit)
  if (notificationId === null) {
    notifications = await query.getMany();
  } else {
    query = query.andWhere("commentNotifications.id < :id", { id: notificationId });
    notifications = await query.getMany();
  }

  const result = notifications.map((notification) => {
    return (
      {
        id: notification.commentId,
        notificationId: notification.id,
        name: notification.comment.user.fullName,
        date: notification.createAt,
        bookTitle: notification.comment.book.title,
        text: notification.comment.description,
        img: `${process.env.BASE_URL}${notification.comment.user.media?.filePath}`,
        bookId: notification.meta.bookId,
        isRead: notification.isRead,
      }
    )
  });

  const total = await commentNotificationsRepository
    .createQueryBuilder('commentNotifications')
    .where("commentNotifications.userId = :userId", { userId: req.user.id })
    .andWhere("commentNotifications.isRead = :isRead", { isRead: false })
    .getCount();

  res.status(200).json({
    data: {
      booksNotifications: result,
    },
    meta: {
      pagination: {
        limit: limit,
        totalAmount: total || 0,
        notViewedAmount: total || 0,
      }
    },
  });
};

export default {
  getCommentBooksNotifications,
  getCommentBookNotification,
  patchNotificationsIsRead,
  getNotViewedBookCommentNotifications,
};