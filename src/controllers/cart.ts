import { In } from "typeorm";
import { BooksInUserCart } from "../db/entities/books-in-user-cart";
import {
  bookRepository,
  booksInUserCartRepository,
  cartRepository,
} from "../db/repositories/repository";
import { AppRequestHandler } from "../utils/types";

const addBookInCart: AppRequestHandler = async (req, res) => {
  await cartRepository
    .createQueryBuilder()
    .insert()
    .values({
      userId: req.user.id,
      status: false
    })
    .orUpdate(["status"], ["userId"], {
      skipUpdateIfNoValuesChanged: true,
      indexPredicate: `"status" = false`,
    })
    .execute();

  const cart = await cartRepository.findOne({
    where: { userId: req.user.id, status: false }
  });

  const book = await bookRepository.findOne({
    where: {
      id: req.body.bookId
    }
  })

  const bookInUserCart = new BooksInUserCart();

  bookInUserCart.book = book;
  bookInUserCart.currentPrice = book.price;
  bookInUserCart.cart = cart;

  await booksInUserCartRepository.save(bookInUserCart);

  return res.status(201).json({ data: { status: 'ok' } });
};

const getCartBooks: AppRequestHandler = async (req, res) => {
  const cart = await cartRepository.findOne({
    where: {
      userId: req.user.id,
      status: false
    }
  });

  const books = await booksInUserCartRepository
    .createQueryBuilder("allBooksInCart")
    .select("allBooksInCart.bookId")
    .addSelect("SUM(allBooksInCart.currentPrice)", "totalPrice")
    .where("allBooksInCart.cartId = :cartId", { cartId: cart.id })
    .groupBy("allBooksInCart.bookId")
    .getRawMany();


  const cartBooksId = books.map((book) => {
    return book.allBooksInCart_bookId
  });


  const uniqueBooks = await bookRepository.find({
    relations: { media: true },
    where: {
      id: In(cartBooksId)
    }
  })

  const cartBooks = books.map((cartBook) => {

    const book = uniqueBooks.find((book) => {
      return book.id === cartBook.allBooksInCart_bookId
    })

    return {
      id: book.id,
      title: book.title,
      author: book.author,
      price: cartBook.totalPrice,
      media: book.media?.filePath || '',
      count: (cartBook.totalPrice * 10 / book.price) / 10
    }
  })

  const totalPrice = books.reduce((sum, book) => {
    return sum + (+book.totalPrice)
  }, 0);

  return res.status(200).json({
    data: {
      books: cartBooks,
      totalPrice: +(totalPrice.toFixed(2)),
    }
  });
};


export default { addBookInCart, getCartBooks };