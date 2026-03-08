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
import { upload } from '../utils/fileUpload.js';

const ReviewRouter = express.Router();

// Get all reviews for a specific book
ReviewRouter.route("/book/:bookId").get(authenticateToken, getReviewsForBookController);

// Add a new review for a book
ReviewRouter.route("/book/:bookId").post(authenticateToken, createReviewController);

// Get reviews written by a user
ReviewRouter.route("/user/:userId").get(authenticateToken, getUserReviewsController);

// Update a specific review
ReviewRouter.route("/book/:reviewId").put(authenticateToken, updateReviewController);

// Delete a specific review
ReviewRouter.route("/book/:reviewId").delete(authenticateToken, deleteReviewController);

// Like a review
ReviewRouter.route("/:reviewId/like").post(authenticateToken, likeReviewController);

export default ReviewRouter;