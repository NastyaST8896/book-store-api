import { commentNotificationsRepository, userRepository } from "../db/repositories/repository";
import { AppError } from "../utils/app-error";
import { AppRequestHandler } from "../utils/types";

const getCommentBooksNotifications: AppRequestHandler = async (req, res) => {
  if (!req.user) {
    throw new AppError('User not found', 404);
  }
  const page = req.validatedQuery?.page || 1;
  const limit = req.validatedQuery?.limit || 5;

  const take = (page + 1) * limit;

  const comments = await commentNotificationsRepository
    .createQueryBuilder('commentNotifications')
    .leftJoinAndSelect('commentNotifications.comment', 'comment')
    .leftJoinAndSelect('comment.book', 'book')
    .leftJoinAndSelect('comment.user', 'user')
    .leftJoinAndSelect('user.media', 'media')
    .where("commentNotifications.userId = :userId", { userId: req.user.id })
    .andWhere("commentNotifications.isRead = :isRead", { isRead: false })
    .orderBy("commentNotifications.createAt", "DESC")
    .take(take)
    .getMany();

  const total = comments.length;

  const result = comments.map((comment) => {
    return (
      {
        id: comment.commentId,
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

  const totalPages = Math.ceil(total / limit);

  const nextPage = (totalPages: number, page: number): number | null => {
    const next = page + 1;

    if (next > totalPages) {
      return null;
    }

    return next;
  };

  const prevPage = (page: number): number | null => {
    const next = page - 1;

    if (next <= 0) {
      return null;
    }

    return next;
  };

  res.status(200).json({
    data: {
      booksNotifications: result,
    },
    meta: {
      pagination: {
        perPage: limit,
        currentPage: page,
        nextPage: nextPage(totalPages, page),
        prevPage: prevPage(page),
        totalPages,
        totalAmount: total
      }
    }
  });
};

export default { getCommentBooksNotifications };