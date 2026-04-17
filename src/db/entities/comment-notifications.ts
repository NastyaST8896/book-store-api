import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "./user";
import { Comments } from "./comments";

export type NotificationMetaType = {
  type: string,
  bookId: number,
  commentAuthorId: number,
}

@Entity()
export class CommentNotifications {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User

  @Column()
  userId: number;

  @ManyToOne(() => Comments, { onDelete: 'CASCADE' })
  comment: Comments

  @Column()
  commentId: number;

  @Column({ type: 'jsonb', nullable: true })
  meta: NotificationMetaType;

  @Column({type: 'boolean', default: false})
  isRead: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createAt: Date;
}