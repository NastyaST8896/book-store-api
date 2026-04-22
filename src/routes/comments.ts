import { Router } from "express";
import { authenticateToken } from "../utils/helpers";
import CommentsController from "../controllers/comments"
import { schemaQueryValidator } from "../schema-query-validator";

export const CommentsRouter = Router()
  .post('/add-comment', authenticateToken, CommentsController.addBookComment)
  .get('/:id', schemaQueryValidator('get-book-comments'), CommentsController.getBookComments);