// import mongoose from "mongoose";
// import { CategoryModal } from "../modal/categoryModel.js";

// const wishlistSchema = mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "users",
//         required: [true, "User ID is required"],
//         unique: true
//     },
//     items: [{
//         bookId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "books",
//             required: [true, "Book ID is required"]
//         },
//         // title: {
//         //     type: String,
//         //     required: [true, "Title is required"],
//         //     trim: true,
//         //     maxlength: [200, "Title cannot exceed 200 characters"]
//         // },
//         // author: {
//         //     type: String,
//         //     required: [true, "Author is required"]
//         // },
//         // price: {
//         //     type: Number,
//         //     required: [true, "Price is required"],
//         //     min: [0, "Price cannot be negative"]
//         // },
//         // coverImage: {
//         //     type: String,
//         //     required: [true, "Cover image is required"]
//         // },
//         // category: {
//         //     type: mongoose.Schema.Types.ObjectId,
//         //     ref: "categories",
//         //     required: [true, "Category is required"]
//         // },
//         // discount: {
//         //     type: Number,
//         //     default: 0
//         // },
//         // language: {
//         //     type: String,
//         //     default: "English"
//         // },
//         addedAt: {
//             type: Date,
//             default: Date.now
//         }
//     }]
// }, { timestamps: true });

// // Optional index for performance
// // wishlistSchema.index({ userId: 1 });

// // Prevent duplicate books in wishlist
// wishlistSchema.pre("save", function (next) {
//     const bookIds = this.items.map(item => item.bookId.toString());
//     const uniqueIds = new Set(bookIds);

//     if (bookIds.length !== uniqueIds.size) {
//         return next(new Error("Duplicate books are not allowed in wishlist"));
//     }
//     next();
// });

// export default mongoose.model("wishlistModel", wishlistSchema);


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

export default mongoose.model("Wishlist", wishlistSchema);