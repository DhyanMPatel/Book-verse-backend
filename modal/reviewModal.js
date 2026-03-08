import mongoose from "mongoose";

export const ReviewSchema = mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "books",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    reviewText: {
        type: String,
        required: true,
        maxlength: 2000,
        trim: true
    },
    isVerifiedPurchase: {
        type: Boolean,
        default: false
    },
    likes: {
        type: Number,
        default: 0,
        min: 0
    },
    // reviewImages: {
    //     type: [String],
    //     default: []
    // }
}, {
    timestamps: true
});

// Indexes for performance optimization
// 1. Fetch reviews for a book
ReviewSchema.index({ bookId: 1, createdAt: -1 });

// 2. Show reviews written by a user
ReviewSchema.index({ userId: 1, createdAt: -1 });

// 3. Sort reviews by rating
ReviewSchema.index({ bookId: 1, rating: -1 });

// 4. A user should only review a book once (compound unique index)
ReviewSchema.index({ bookId: 1, userId: 1 }, { unique: true });

export const ReviewModal = mongoose.model("review", ReviewSchema);