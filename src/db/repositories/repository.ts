import { AppDataSource } from "../../config/database";
import { User } from '../entities/user'
import { RefreshToken } from '../entities/refresh-token';
import { Media } from "../entities/media";
import { Book } from '../entities/book';
import { Genre } from "../entities/Genre";

export const userRepository = AppDataSource.getRepository(User);
export const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
export const mediaRepository = AppDataSource.getRepository(Media);
export const bookRepository = AppDataSource.getRepository(Book);
export const genreRepository = AppDataSource.getRepository(Genre);
