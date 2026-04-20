import { Router } from "express";
import { authenticateToken } from "../utils/helpers";
import CommentNotificationsController from "../controllers/comment-notifications";

export const CommentNotificationsRouter = Router()
  .get(
    '/book-notifications',
    authenticateToken,
    CommentNotificationsController.getCommentBooksNotifications
  );