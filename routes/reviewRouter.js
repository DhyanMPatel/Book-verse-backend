import express from 'express';
import {
    createReviewController,
    deleteReviewController,
    getReviewsForBookController,
    getUserReviewsController,
    likeReviewController,
    updateReviewController
} from '../controllers/reviewController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const reviewRouter = express.Router();

// Get all reviews for a specific book
reviewRouter.route("/book/:bookId").get(authenticateToken, getReviewsForBookController);

// Add a new review for a book
reviewRouter.route("/book/:bookId").post(authenticateToken, createReviewController);

// Get reviews written by a user
reviewRouter.route("/user/:userId").get(authenticateToken, getUserReviewsController);

// Update a specific review
reviewRouter.route("/book/:reviewId").put(authenticateToken, updateReviewController);

// Delete a specific review
reviewRouter.route("/book/:reviewId").delete(authenticateToken, deleteReviewController);

// Like a review
reviewRouter.route("/:reviewId/like").post(authenticateToken, likeReviewController);

export default reviewRouter;