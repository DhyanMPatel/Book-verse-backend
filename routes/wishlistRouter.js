import express from "express";
import {
    getWishlistController,
    addToWishlistController,
    removeFromWishlistController,
    clearWishlistController,
    getWishlistByUserIdController,
} from "../controllers/wishlistController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";

const wishlistRouter = express.Router();

// Get wishlist
wishlistRouter.get("/get", authenticateToken, getWishlistController);

// Get wishlist by user ID (admin or self)
wishlistRouter.get("/wishlist/:userId", authenticateToken, getWishlistByUserIdController);

// Add book to wishlist
wishlistRouter.post("/add", authenticateToken, addToWishlistController);

// Remove book from wishlist
wishlistRouter.delete("/remove/:bookId", authenticateToken, removeFromWishlistController);

// Clear wishlist
wishlistRouter.delete("/clear", authenticateToken, clearWishlistController);

export default wishlistRouter;