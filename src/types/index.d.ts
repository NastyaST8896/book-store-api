import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      validatedQuery?: {
        page?: number;
        limit?: number;
        filter?: string;
        maxPrice?: number;
        minPrice?: number;
        genres?: string[];
      };
      user?: {
        id: number;
        email: string;
      };
    }
  }
}