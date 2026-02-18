import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  OneToOne,
  JoinColumn
} from 'typeorm';
import { User } from './user';

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

  @CreateDateColumn({type: 'timestamp'})
  createAt: Date;
}