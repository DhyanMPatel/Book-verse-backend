import mongoose from "mongoose";

const wishlistSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: [true, "User ID is required"],
            unique: true,
        },
        books: [
            {
                bookId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "books",
                    required: [true, "Book ID is required"],
                },
            },
        ],
    },
    { timestamps: true }
);

const WishlistModal = mongoose.model("Wishlist", wishlistSchema);

export default WishlistModal;