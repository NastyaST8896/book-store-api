import { AppDataSource } from "../config/database";
import { User } from '../db/entities/user'

export const userRepository = AppDataSource.getRepository(User);