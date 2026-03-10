import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "./user";
import { Book } from "./book";

@Entity()
export class BooksRating {
  @ManyToOne(() => User, (user) => user.booksRating)
  @JoinColumn({ name: 'userId' })
  user: User

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => Book, (book) => book.booksRating)
  @JoinColumn({ name: 'bookId' })
  book: Book

  @PrimaryColumn()
  bookId: number;

  @Column('float', { nullable: true })
  rating: number;
}