import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Media } from './media';

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

  @Column()
  genre: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('float', { nullable: true })
  rating: number;

  @OneToOne(() => Media, (image) => image.book, {
    cascade: true,
    eager: true,
  })

  @JoinColumn()
  media: Media;
}