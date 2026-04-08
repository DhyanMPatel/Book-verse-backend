// import wishlistModel from "../modal/wishlistModel.js"
// // import { CategoryModal } from "../modal/categoryModel.js";
// import APIResponse from "../utils/APIResponse.js";
// import mongoose from "mongoose";

// // Get Wishlist
// export const getWishlistController = async (req, res) => {
//     try {
//         const userId = req.user.id;

//         const wishlist = await wishlistModel.findOne({ userId }).populate("items.bookId");

//         if (!wishlist) {
//             return res.status(200).json({
//                 success: true,
//                 message: "Wishlist is empty",
//                 data: { items: [] }
//             });
//         }

//         res.status(200).json({
//             success: true,
//             data: wishlist
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Error fetching wishlist",
//             error: error.message
//         });
//     }
// };



// export const addToWishlistController = async (req, res) => {
//     try {
//         const userId = req.user?.id;

//         if (!userId) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Unauthorized"
//             });
//         }

//         const { bookId } = req.body;

//         if (!bookId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Book ID is required"
//             });
//         }

//         if (!mongoose.Types.ObjectId.isValid(bookId)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid bookId"
//             });
//         }

//         const item = {
//             bookId: new mongoose.Types.ObjectId(bookId),
//         };

//         let wishlist = await wishlistModel.findOne({ userId });

//         if (!wishlist) {
//             wishlist = new wishlistModel({
//                 userId,
//                 items: [item]
//             });
//         } else {
//             const exists = wishlist.items.some(
//                 (i) => i.bookId.toString() === bookId
//             );

//             if (exists) {
//                 return res.status(400).json({
//                     success: false,
//                     message: "Book already in wishlist"
//                 });
//             }

//             wishlist.items.push(item);
//         }

//         await wishlist.save();

//         res.status(200).json({
//             success: true,
//             message: "Item added to wishlist",
//             data: wishlist
//         });

//     } catch (error) {
//         console.error("Wishlist Error:", error);
//         res.status(500).json({
//             success: false,
//             message: "Error adding to wishlist",
//             error: error.message
//         });
//     }
// };

// // Add to Wishlist
// // export const addToWishlistController = async (req, res) => {
// //     try {
// //         const userId = req.user.id;
// //         const { bookId } = req.body;
// //         //  title, author, price, coverImage, category, discount, avgRating, language,
         

// //         // Validate required fields
// //         // if (!bookId || !title || !author || !price || !coverImage || !category) {
// //         if (!bookId) {
// //             return res.status(400).json({
// //                 success: false,
// //                 message: "Missing required fields"
// //             });
// //         }

// //         const item = {
// //             bookId: new mongoose.Types.ObjectId(bookId),
// //             // title,
// //             // author,
// //             // price,
// //             // coverImage,
// //             // category: new mongoose.Types.ObjectId(category),
// //             // discount: discount || 0,
// //             // avgRating: avgRating || 0,
// //             // language: language || "English",
// //         };

// //         let wishlist = await wishlistModel.findOne({ userId });

// //         if (!wishlist) {
// //             wishlist = new wishlistModel({
// //                 userId,
// //                 items: [item]
// //             });
// //         } else {
// //             const exists = wishlist.items.some(
// //                 (i) => i.bookId.toString() === bookId
// //             );

// //             if (exists) {
// //                 return res.status(400).json({
// //                     success: false,
// //                     message: "Book already in wishlist"
// //                 });
// //             }

// //             wishlist.items.push(item);
// //         }

// //         await wishlist.save();

// //         res.status(200).json({
// //             success: true,
// //             message: "Item added to wishlist",
// //             data: wishlist
// //         });

// //     } catch (error) {
// //         res.status(500).json({
// //             success: false,
// //             message: "Error adding to wishlist",
// //             error: error.message
// //         });
// //     }
// // };

// // Remove from Wishlist
// export const removeFromWishlistController = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const { bookId } = req.params;

//         if (!bookId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "bookId parameter is required"
//             });
//         }

//         const wishlist = await wishlistModel.findOne({ userId });

//         if (!wishlist) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Wishlist not found"
//             });
//         }

//         // Filter out the book to remove
//         const initialCount = wishlist.items.length;
//         wishlist.items = wishlist.items.filter(
//             (item) => item.bookId.toString() !== bookId
//         );

//         if (wishlist.items.length === initialCount) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Book not found in wishlist"
//             });
//         }

//         await wishlist.save();

//         res.status(200).json({
//             success: true,
//             message: "Item removed from wishlist",
//             data: wishlist
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Error removing item",
//             error: error.message
//         });
//     }
// };

// // Clear Wishlist
// export const clearWishlistController = async (req, res) => {
//     try {
//         const userId = req.user.id;

//         const wishlist = await wishlistModel.findOne({ userId });

//         if (!wishlist) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Wishlist not found"
//             });
//         }

//         // Clear all items
//         wishlist.items = [];
//         await wishlist.save();

//         res.status(200).json({
//             success: true,
//             message: "Wishlist cleared",
//             data: wishlist
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Error clearing wishlist",
//             error: error.message
//         });
//     }
// };


import WishlistModal from "../modal/wishlistModel.js";
import BookModal from "../modal/bookModal.js";
import APIResponse from "../utils/APIResponse.js";

// GET /wishlist/get
export const getWishlistController = async (req, res) => {
    try {
        const userId = req.user.id;

        const wishlist = await WishlistModal.findOne({ userId }).populate(
            "books.bookId"
        );

        if (!wishlist || wishlist.books.length === 0) {
            return APIResponse.successResponse(
                res,
                { books: [] },
                "Wishlist is empty",
                200
            );
        }

        APIResponse.successResponse(
            res,
            wishlist,
            "Wishlist fetched successfully",
            200
        );
    } catch (error) {
        APIResponse.errorResponse(res, error?.message || error, 500);
    }
};

// POST /wishlist/add  —  body: { bookId }
export const addToWishlistController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { bookId } = req.body;

        if (!bookId) {
            return APIResponse.errorResponse(res, "Book ID is required", 400);
        }

        // Check if book exists
        const book = await BookModal.findById(bookId);
        if (!book) {
            return APIResponse.errorResponse(res, "Book not found", 404);
        }

        // Find or create wishlist
        let wishlist = await WishlistModal.findOne({ userId });
        if (!wishlist) {
            wishlist = new WishlistModal({ userId, books: [] });
        }

        // Prevent duplicates
        const alreadyAdded = wishlist.books.some(
            (item) => item.bookId.toString() === bookId
        );
        if (alreadyAdded) {
            return APIResponse.errorResponse(
                res,
                "Book already in wishlist",
                400
            );
        }

        wishlist.books.push({ bookId });
        await wishlist.save();

        APIResponse.successResponse(
            res,
            wishlist,
            "Book added to wishlist successfully",
            200
        );
    } catch (error) {
        APIResponse.errorResponse(res, error?.message || error, 500);
    }
};

// DELETE /wishlist/remove/:bookId
export const removeFromWishlistController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { bookId } = req.params;

        if (!bookId) {
            return APIResponse.errorResponse(res, "Book ID is required", 400);
        }

        const wishlist = await WishlistModal.findOne({ userId });
        if (!wishlist) {
            return APIResponse.errorResponse(res, "Wishlist not found", 404);
        }

        const exists = wishlist.books.some(
            (item) => item.bookId.toString() === bookId
        );
        if (!exists) {
            return APIResponse.errorResponse(
                res,
                "Book not found in wishlist",
                404
            );
        }

        wishlist.books = wishlist.books.filter(
            (item) => item.bookId.toString() !== bookId
        );
        await wishlist.save();

        APIResponse.successResponse(
            res,
            wishlist,
            "Book removed from wishlist successfully",
            200
        );
    } catch (error) {
        APIResponse.errorResponse(res, error?.message || error, 500);
    }
};

// DELETE /wishlist/clear
export const clearWishlistController = async (req, res) => {
    try {
        const userId = req.user.id;

        await WishlistModal.deleteOne({ userId });

        APIResponse.successResponse(
            res,
            null,
            "Wishlist cleared successfully",
            200
        );
    } catch (error) {
        APIResponse.errorResponse(res, error?.message || error, 500);
    }
};