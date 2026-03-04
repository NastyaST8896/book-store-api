import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "./user";
import { Book } from "./book";

@Entity()
export class BooksRating {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.booksRating)
  @JoinColumn({ name: 'userId' })
  user: User

  @Column()
  userId: number;

  @ManyToOne(() => Book, (book) => book.booksRating)
  @JoinColumn({ name: 'bookId' })
  book: Book

  @Column()
  bookId: number;

  @Column('float', { nullable: true })
  rating: number;
}