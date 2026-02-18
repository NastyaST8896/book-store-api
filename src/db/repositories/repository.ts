import { AppDataSource } from "../../config/database";
import { User } from '../entities/user'
import { RefreshToken } from '../entities/refresh-token';
import { Media } from "../entities/media";

export const userRepository = AppDataSource.getRepository(User);
export const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
export const mediaRepository = AppDataSource.getRepository(Media);