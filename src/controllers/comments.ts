import { AppRequestHandler } from "../utils/types";
import { Comments } from "../db/entities/comments";
import { commentsRepository } from "../db/repositories/repository";

const addBookComment: AppRequestHandler = async (req, res) => {
  console.log(req.user.id, req.body.bookId, req.body.text);

  const newComment = new Comments;

  newComment.bookId = req.body.bookId;
  newComment.userId = req.user.id;
  newComment.description = req.body.text;

  commentsRepository.save(newComment);

  return res.status(200).json({ data: { status: 'ok' } });
};

// const getBookComments: AppRequestHandler = async (req, res) => {

// };

export default {
  addBookComment,
  // getBookComments 
};