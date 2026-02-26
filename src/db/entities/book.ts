import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn, ManyToMany,
  JoinTable,
} from 'typeorm';
import { Media } from './media';
import { User } from './user';
import { Genre } from './Genre';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ type: 'date', name: 'release_date' })
  releaseDate: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('float', { nullable: true })
  rating: number;

  @OneToOne(() => Media, (image) => image.book, {
    cascade: true
  })

  @JoinColumn()
  media: Media;

  @ManyToMany(() => User, (user) => user.likedBooks)
  likedBy: User[];

  @ManyToMany(() => Genre, (genre) => genre.books)
  @JoinTable()
  genres:Genre[];
}