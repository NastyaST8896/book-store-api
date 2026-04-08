import { AppRequestHandler } from "../utils/types";
import { Comments } from "../db/entities/comments";
import { commentsRepository } from "../db/repositories/repository";

const addBookComment: AppRequestHandler = async (req, res) => {
  const newComment = new Comments;

  newComment.bookId = req.body.bookId;
  newComment.userId = req.user.id;
  newComment.description = req.body.text;

  commentsRepository.save(newComment);

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

   if(comments) {
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