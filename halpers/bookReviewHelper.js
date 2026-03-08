import mongoose from "mongoose";
import BookModal from "../modal/bookModal.js";
import { ReviewModal } from "../modal/reviewModal.js";

// Helper function to update book review statistics
export const updateBookReviewStats = async (bookId) => {
    try {
        const stats = await ReviewModal.aggregate([
            { $match: { bookId: new mongoose.Types.ObjectId(bookId) } },
            {
                $group: {
                    _id: "$bookId",
                    avgRating: { $avg: "$rating" },
                    totalReviews: { $sum: 1 }
                }
            }
        ]);

        const reviewStats = stats[0] || { avgRating: 0, totalReviews: 0 };

        await BookModal.findByIdAndUpdate(bookId, {
            avgRating: Math.round(reviewStats.avgRating * 10) / 10, // Round to 1 decimal
            totalReviews: reviewStats.totalReviews
        });

        return reviewStats;
    } catch (error) {
        console.error("Error updating book review stats:", error);
        throw error;
    }
};