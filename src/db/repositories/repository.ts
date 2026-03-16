import { AppDataSource } from "../../config/database";
import { User } from '../entities/user'
import { RefreshToken } from '../entities/refresh-token';
import { Media } from "../entities/media";
import { Book } from '../entities/book';
import { Genre } from "../entities/genre";
import { BooksRating } from "../entities/books-rating";
import { Cart } from "../entities/cart";
import { BooksInUserCart } from "../entities/books-in-user-cart";

export const userRepository = AppDataSource.getRepository(User);
export const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
export const mediaRepository = AppDataSource.getRepository(Media);
export const bookRepository = AppDataSource.getRepository(Book);
export const genreRepository = AppDataSource.getRepository(Genre);
export const ratingRepository = AppDataSource.getRepository(BooksRating);
export const cartRepository = AppDataSource.getRepository(Cart);
export const booksInUserCartRepository = AppDataSource.getRepository(BooksInUserCart);