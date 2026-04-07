import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Book } from "./book";

@Entity()
export class Comments {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Book, (book) => book.comments)
  book: Book;

  @Column()
  bookId: number;

  @Column('text', { nullable: true })
  description: string;

  @CreateDateColumn({ type: 'timestamp' })
  createAt: Date;
}