import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      validatedQuery?: {
        page?: number;
        limit?: number;
        sortBy?: string;
        maxPrice?: number;
        minPrice?: number;
        genres?: string[];
        searchValue?: string[];
        notificationId?: number;
        commentId?: nember;
      };
      user?: {
        id: number;
        email: string;
      };
    }
  }
}