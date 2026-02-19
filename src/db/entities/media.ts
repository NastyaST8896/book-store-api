import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  OneToOne,
} from 'typeorm';
import { User } from './user';
import { Book } from './book';

@Entity()
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  originalName: string;

  @Column({ nullable: false })
  uploadName: string;

  @Column({})
  filePath: string;

  @Column()
  mimeType: string;

  @Column('int')
  size: number;

  @OneToOne(()  => User, (user) => user.media)
  user: User;

  @OneToOne(() => Book, (book) => book.media) // указываем обратную связь
  book: Book;

  @CreateDateColumn({type: 'timestamp'})
  createAt: Date;
}