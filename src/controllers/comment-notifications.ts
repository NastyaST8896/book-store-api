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
    .take(10)
    .getMany();

  const result = comments.map((comment) => {
    // const author = await userRepository.findOne({
    //   relations: { media: true },
    //   where: { id: comment.userId }
    // });

    // const book = await bookRepository.findOne({
    //   where: { id: comment.meta.bookId }
    // });

    return (
      {
        id: comment.commentId,
        name: comment.user.fullName,
        date: comment.createAt,
        bookTitle: 'title',
        text: comment.comment.description,
        img: `${process.env.BASE_URL} uploads/cover-1771846339695.png`,
        bookId: comment.meta.bookId
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