import { Router } from "express";
import { authenticateToken } from "../utils/helpers";
import CartController from "../controllers/cart" 

export const CartRouter = Router()
  .post('/add-book-in-cart', authenticateToken, CartController.addBookInCart)