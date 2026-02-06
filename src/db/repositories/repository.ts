import { AppDataSource } from "../../config/database";
import { User } from '../entities/user'

export const userRepository = AppDataSource.getRepository(User);