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

  if (notificationId === null) {
    comments = await commentNotificationsRepository
      .createQueryBuilder('commentNotifications')
      .leftJoinAndSelect('commentNotifications.comment', 'comment')
      .leftJoinAndSelect('comment.book', 'book')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('user.media', 'media')
      .where("commentNotifications.userId = :userId", { userId: req.user.id })
      .andWhere("commentNotifications.isRead = :isRead", { isRead: false })
      .orderBy("commentNotifications.createAt", "DESC")
      .take(limit)
      .getMany();
  } else {
    comments = await commentNotificationsRepository
      .createQueryBuilder('commentNotifications')
      .leftJoinAndSelect('commentNotifications.comment', 'comment')
      .leftJoinAndSelect('comment.book', 'book')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('user.media', 'media')
      .where("commentNotifications.userId = :userId", { userId: req.user.id })
      .andWhere("commentNotifications.isRead = :isRead", { isRead: false })
      .andWhere("commentNotifications.id < :id", { id: notificationId })
      .orderBy("commentNotifications.createAt", "DESC")
      .take(limit)
      .getMany();
  }

  const total = await commentNotificationsRepository
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
        isRead: false,
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
        totalAmount: total || 0
      }
    }
  });
};

export default { getCommentBooksNotifications };