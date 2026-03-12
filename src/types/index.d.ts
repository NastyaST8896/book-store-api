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
      };
      user?: {
        id: number;
        email: string;
      };
    }
  }
}