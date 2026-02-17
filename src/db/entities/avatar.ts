import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn 
} from 'typeorm';

@Entity()
export class Avatar {
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

  @CreateDateColumn({type: 'timestamp'})
  createAt: Date;
}