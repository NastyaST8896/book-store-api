import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Book } from "./book";
import { Cart } from "./cart";

@Entity()
export class BooksInUserCart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.BooksInUserCart)
  cart:  Cart;

  @Column()
  cartId: number;

  @ManyToOne(() => Book, (book) => book.BooksInUserCart)
  book:  Book;

  @Column()
  bookId: number;

  @Column('decimal', { precision: 10, scale: 2 })
   currentPrice: number;
}