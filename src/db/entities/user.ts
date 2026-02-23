import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToMany, JoinTable
} from 'typeorm';
import { RefreshToken } from './refresh-token';
import { Media } from './media';
import jwt from 'jsonwebtoken';
import { Book } from './book';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

  @OneToOne(() => Media)
  @JoinColumn()
  media: Media | null;

  @ManyToMany(() => Book, (book) => book.likedBy)
  @JoinTable({ name: "user_book_likes" })
  likedBooks: Book[];

  generateToken() {
    return jwt.sign(
      { id: this.id, email: this.email },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '60m' }
    );
  }
}
