import { Router } from "express";
import { authenticateToken } from "../utils/helpers";
import CommentNotificationsController from "../controllers/comment-notifications";
import { schemaQueryValidator } from "../schema-query-validator";

export const CommentNotificationsRouter = Router()
  .get(
    '/book-notifications',
    authenticateToken,
    schemaQueryValidator('get-book-comments-notifications'),
    CommentNotificationsController.getCommentBooksNotifications
  );