import { Router } from "express";
import { authenticateToken } from "../utils/helpers";
import CommentsController from "../controllers/comments"

export const CommentsRouter = Router()
  .post('/add-comment', authenticateToken, CommentsController.addBookComment)
  .get('/:id', CommentsController.getBookComments);