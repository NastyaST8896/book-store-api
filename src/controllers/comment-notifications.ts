import { commentNotificationsRepository } from "../db/repositories/repository";
import { ConnectionManager } from "../socket";
import { AppError } from "../utils/app-error";
import { AppRequestHandler } from "../utils/types";

const getCommentBooksNotifications: AppRequestHandler = async (req, res) => {
  if (!req.user) {
    throw new AppError('User not found', 404);
  }

  const socket = ConnectionManager.getSocketByUserId(String(req.user.id));

  const comments = await commentNotificationsRepository
    .createQueryBuilder('commentNotifications')
    .leftJoinAndSelect('commentNotifications.comment', 'comment')
    .leftJoinAndSelect('commentNotifications.user', 'user')
    .where("commentNotifications.userId = :userId", { userId: req.user.id })
    .andWhere("commentNotifications.isRead = :isRead", { isRead: false })
    .orderBy("commentNotifications.createAt", "DESC")
    .take(5)
    .getMany();

    console.log(comments);

    const authorsId = comments.map((comment) => {
      return comment.comment.userId
    });

    console.log(authorsId);

  const result = comments.map((comment) => {

    return (
      {
        id: comment.commentId,
        name: comment.user.fullName,
        date: comment.createAt,
        bookTitle: 'title',
        text: comment.comment.description,
        img: `${process.env.BASE_URL} uploads/cover-1771846339695.png`,
        bookId: comment.meta.bookId,
        isRead: false,
      }
    )
  })

  res.status(200).json({
    data: {
      booksNotifications: result,
    }
  });
};

export default { getCommentBooksNotifications };