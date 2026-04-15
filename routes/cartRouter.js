import express from 'express';
import {
    getCartController,
    addItemToCartController,
    updateCartItemController,
    removeCartItemController,
    getCartByUserIdController,
    clearCartController
} from "../controllers/cartController.js";

import { authenticateToken } from '../middleware/authMiddleware.js';

const cartRouter = express.Router();

// Get cart
cartRouter.get('/get', authenticateToken, getCartController);

// Get cart by user ID (admin or user can access)
cartRouter.get("/cart/:userId", authenticateToken, getCartByUserIdController);

// Add item to cart
cartRouter.post('/add', authenticateToken, addItemToCartController);

// Update cart item
cartRouter.put('/update', authenticateToken, updateCartItemController);

// Remove item from cart
cartRouter.delete('/remove/:bookId', authenticateToken, removeCartItemController);

// Clear cart
cartRouter.delete('/clear', authenticateToken, clearCartController);

export default cartRouter;