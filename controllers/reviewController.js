import { ReviewModal } from "../modal/reviewModal.js";
import UserModal from "../modal/userModal.js";
import BookModal from "../modal/bookModal.js";
import APIResponse from "../utils/APIResponse.js";
import mongoose from "mongoose";
import { updateBookReviewStats } from "../halpers/bookReviewHelper.js";


// Get all reviews for a book
export const getReviewsForBookController = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

        // Validate book exists
        const book = await BookModal.findById(bookId);
        if (!book) {
            return APIResponse.errorResponse(res, "Book not found", 404);
        }

        // Build sort object
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Get reviews with pagination
        const reviews = await ReviewModal.find({ bookId })
            .populate('userId', 'name email')
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();


        if (!reviews || reviews.length === 0) {
            return APIResponse.successResponse(res, {
                bookId,
                bookStats: {
                    avgRating: book.avgRating || 0,
                    totalReviews: book.totalReviews || 0
                },
                reviews: [],
                pagination: {
                    current: parseInt(page),
                    pageSize: parseInt(limit),
                    total: 0,
                    pages: 0
                }
            }, "Reviews fetched successfully", 200);
        }

        // Get total count for pagination
        const total = await ReviewModal.countDocuments({ bookId });

        const reviewData = reviews.map(review => ({
            id: review._id,
            bookId: review.bookId,
            userId: review.userId,
            rating: review.rating,
            // title: review.title,
            reviewText: review.reviewText,
            isVerifiedPurchase: review.isVerifiedPurchase,
            likes: review.likes,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
            // user: {
            //     name: review.userId?.name,
            //     email: review.userId?.email
            // }
        }));

        return APIResponse.successResponse(res, {
            bookId,
            bookStats: {
                avgRating: book.avgRating || 0,
                totalReviews: book.totalReviews || 0
            },
            reviews: reviewData,
            pagination: {
                current: parseInt(page),
                pageSize: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        }, "Reviews fetched successfully", 200);

    } catch (error) {
        return APIResponse.errorResponse(res, error.message, 500);
    }
};

// Add a new review for a book
export const createReviewController = async (req, res) => {
    try {
        const { rating, reviewText } = req.body;
        const {bookId} = req.params;
        const userId = req.user.id; // Get from authenticated user

        // const imagesPath = req.files?.map(file => file?.path)

        // Validate required fields
        if (!rating || !reviewText || !bookId) {
            return APIResponse.errorResponse(res, "Missing required fields: rating, reviewText, bookId", 400);
        }

        // Validate rating range
        if (rating < 1 || rating > 5) {
            return APIResponse.errorResponse(res, "Rating must be between 1 and 5", 400);
        }

        // Validate book exists
        const book = await BookModal.findById(bookId);
        if (!book) {
            return APIResponse.errorResponse(res, "Book not found", 404);
        }

        // Validate user exists
        const user = await UserModal.findById(userId);
        if (!user) {
            return APIResponse.errorResponse(res, "User not found", 404);
        }

        // Clean up any existing null userId reviews for this book first
        // await ReviewModal.deleteMany({
        //     bookId: new mongoose.Types.ObjectId(bookId),
        //     userId: null
        // });

        // Check if user already reviewed this book
        const existingReview = await ReviewModal.findOne({
            bookId: new mongoose.Types.ObjectId(bookId),
            userId: new mongoose.Types.ObjectId(userId)
        });

        if (existingReview) {
            return APIResponse.errorResponse(res, "You have already reviewed this book", 400);
        }

        // Create new review
        const newReview = new ReviewModal({
            bookId: new mongoose.Types.ObjectId(bookId),
            userId: new mongoose.Types.ObjectId(userId),
            rating: Number(rating),
            reviewText: reviewText.trim(),
            isVerifiedPurchase: false, // You can implement purchase verification logic
            // reviewImages: imagesPath || []
        });

        const savedReview = await newReview.save();

        if (!savedReview) {
            return APIResponse.errorResponse(res, "Failed to save review", 500);
        }

        // Update book review statistics
        await updateBookReviewStats(bookId);

        // Return the newly added review
        return APIResponse.successResponse(res, {
            id: savedReview._id,
            bookId: savedReview.bookId,
            userId: savedReview.userId,
            rating: savedReview.rating,
            reviewText: savedReview.reviewText,
            // reviewImages: savedReview.reviewImages,
            isVerifiedPurchase: savedReview.isVerifiedPurchase,
            likes: savedReview.likes,
            createdAt: savedReview.createdAt,
            updatedAt: savedReview.updatedAt
        }, "Review added successfully", 201);

    } catch (error) {
        // Handle duplicate key error (user already reviewed this specific book)
        if (error.code === 11000) {

            // Check if it's the specific bookId+userId duplicate
            if (error.keyPattern && error.keyPattern.bookId && error.keyPattern.userId) {
                return APIResponse.errorResponse(res, "You have already reviewed this book", 400);
            }

            return APIResponse.errorResponse(res, "Duplicate entry detected", 400);
        }
        console.error("Review creation error:", error);
        return APIResponse.errorResponse(res, error.message, 500);
    }
};

// Get reviews written by a user
export const getUserReviewsController = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        // Validate user exists
        const user = await UserModal.findById(userId);
        if (!user) {
            return APIResponse.errorResponse(res, "User not found", 404);
        }

        // Get user's reviews with pagination
        const reviews = await ReviewModal.find({ userId })
            .populate('bookId', 'reviewText author coverImage')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        // Get total count for pagination
        const total = await ReviewModal.countDocuments({ userId });

        const reviewData = reviews.map(review => ({
            reviewId: review._id,
            userId: review.userId,
            rating: review.rating,
            reviewText: review.reviewText,
            isVerifiedPurchase: review.isVerifiedPurchase,
            book: {
                bookId: review.bookId?._id,
                author: review.bookId?.author,
                coverImage: review.bookId?.coverImage
            },
            likes: review.likes,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt
        }));

        return APIResponse.successResponse(res, {
            userId,
            user: {
                name: user.name,
                email: user.email
            },
            reviews: reviewData,
            pagination: {
                current: parseInt(page),
                pageSize: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        }, "User reviews fetched successfully", 200);

    } catch (error) {
        return APIResponse.errorResponse(res, error.message, 500);
    }
};

// Update a review
export const updateReviewController = async (req, res) => {
    try {
        // const { rating, title, reviewText } = req.body;
        const { rating, reviewText } = req.body;
        const { reviewId } = req.params;
        const userId = req.user.id; // Get from authenticated user

        // Validate required fields
        // if (!rating || !title || !reviewText) {
        if (!rating || !reviewText) {
            return APIResponse.errorResponse(res, "Missing required fields: rating, reviewText", 400);
        }

        // Validate rating range
        if (rating < 1 || rating > 5) {
            return APIResponse.errorResponse(res, "Rating must be between 1 and 5", 400);
        }

        // Find the review
        const review = await ReviewModal.findOne({ _id: reviewId, userId });
        if (!review) {
            return APIResponse.errorResponse(res, "Review not found or you don't have permission to update it", 404);
        }

        // Update the review
        review.rating = Number(rating);
        // review.title = title.trim();
        review.reviewText = reviewText.trim();

        const savedReview = await review.save();

        if (!savedReview) {
            return APIResponse.errorResponse(res, "Failed to update review", 500);
        }

        // Update book review statistics
        await updateBookReviewStats(review.bookId);

        return APIResponse.successResponse(res, {
            id: savedReview._id,
            bookId: savedReview.bookId,
            userId: savedReview.userId,
            rating: savedReview.rating,
            // title: savedReview.title,
            reviewText: savedReview.reviewText,
            isVerifiedPurchase: savedReview.isVerifiedPurchase,
            likes: savedReview.likes,
            createdAt: savedReview.createdAt,
            updatedAt: savedReview.updatedAt
        }, "Review updated successfully", 200);

    } catch (error) {
        return APIResponse.errorResponse(res, error.message, 500);
    }
};

// Delete a review
export const deleteReviewController = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user.id; // Get from authenticated user

        // Find the review
        const review = await ReviewModal.findOne({ _id: reviewId, userId });
        if (!review) {
            return APIResponse.errorResponse(res, "Review not found or you don't have permission to delete it", 404);
        }

        const bookId = review.bookId;

        // Delete the review
        await ReviewModal.deleteOne({ _id: reviewId });

        // Update book review statistics
        await updateBookReviewStats(bookId);

        return APIResponse.successResponse(res, null, "Review deleted successfully", 200);

    } catch (error) {
        return APIResponse.errorResponse(res, error.message, 500);
    }
};

// Like/unlike a review
export const likeReviewController = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user.id; // Get from authenticated user

        // Find the review
        const review = await ReviewModal.findById(reviewId);
        if (!review) {
            return APIResponse.errorResponse(res, "Review not found", 404);
        }

        // Increment likes (you can implement more sophisticated like system with user tracking)
        review.likes += 1;

        const savedReview = await review.save();

        if (!savedReview) {
            return APIResponse.errorResponse(res, "Failed to like review", 500);
        }

        return APIResponse.successResponse(res, {
            likes: savedReview.likes
        }, "Review liked successfully", 200);

    } catch (error) {
        return APIResponse.errorResponse(res, error.message, 500);
    }
};