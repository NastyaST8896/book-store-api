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
  )
  .get(
    '/book-notification',
    authenticateToken,
    schemaQueryValidator('get-book-comment-notification'),
    CommentNotificationsController.getCommentBookNotification
  )
  .patch(
    '/viewed',
    authenticateToken,
    CommentNotificationsController.patchNotificationsIsRead
  )
  .get(
    '/not-viewed-notifications',
    authenticateToken,
    schemaQueryValidator('get-book-comments-notifications'),
    CommentNotificationsController.getCommentBooksNotifications
  );