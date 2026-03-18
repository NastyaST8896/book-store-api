import { In } from "typeorm";
import { BooksInUserCart } from "../db/entities/books-in-user-cart";
import { Cart } from "../db/entities/cart";
import {
  bookRepository,
  booksInUserCartRepository,
  cartRepository,
  userRepository
} from "../db/repositories/repository";
import { AppRequestHandler } from "../utils/types";

const addBookInCart: AppRequestHandler = async (req, res) => {
  const cart = await cartRepository.findOne({
    where: {
      userId: req.user.id,
      status: false
    }
  });

  const book = await bookRepository.findOne({
    where: {
      id: req.body.bookId
    }
  })

  if (!cart && req.user) {

    const newCart = new Cart();

    const user = await userRepository.findOne({
      where: {
        id: req.user.id
      }
    });

    newCart.user = user;
    newCart.userId = user.id;
    newCart.status = false;

    await cartRepository.save(newCart);
  }

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