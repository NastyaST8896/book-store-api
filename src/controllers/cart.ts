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
      id: req.body.id
    }
  })

  if(!cart && req.user) {

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

  return res.status(201).json({bookInUserCart, cart});
};

 

export default { addBookInCart };