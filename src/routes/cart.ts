import { Router } from "express";
import { authenticateToken } from "../utils/helpers";
import CartController from "../controllers/cart" 

export const CartRouter = Router()
  .post('/add-book', authenticateToken, CartController.addBookInCart)
  .get('/books', authenticateToken, CartController.getCartBooks);
  