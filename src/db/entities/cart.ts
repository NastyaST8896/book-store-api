import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "./user";
import { BooksInUserCart } from "./books-in-user-cart";

@Entity()
@Index(
  'unique-active-cart',
  ['userId'],
  { unique: true, where: '"status" = false' }
)
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  isCheckout: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => User, (user) => user.cart)
  user: User;

  @Column()
  userId: number;

  @OneToMany(() => BooksInUserCart, (BooksInUserCart) => BooksInUserCart.cart)
  BooksInUserCart: BooksInUserCart[];
}