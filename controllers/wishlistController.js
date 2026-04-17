
import WishlistModal from "../modal/wishlistModel.js";
import BookModal from "../modal/bookModal.js";
import APIResponse from "../utils/APIResponse.js";




export const getWishlistController = async (req, res) => {
    try {
        const userId = req.user.id;

        const wishlist = await WishlistModal.findOne({ userId }).populate(
            "books.bookId",
            "title author price coverImage"
        );

        if (!wishlist || wishlist.books.length === 0) {
            return APIResponse.successResponse(
                res,
                { books: [] },
                "Wishlist is empty",
                200
            );
        }

        const formattedWishlist = {
            id: wishlist._id,
            userId: wishlist.userId,
            books: wishlist.books.map(item => ({
                id: item.bookId?._id,
                title: item.bookId?.title,
                author: item.bookId?.author,
                price: item.bookId?.price,
                coverImage: item.bookId?.coverImage, // ✅ ADDED
            })),
        };

        APIResponse.successResponse(
            res,
            formattedWishlist,
            "Wishlist fetched successfully",
            200
        );

    } catch (error) {
        APIResponse.errorResponse(res, error?.message || error, 500);
    }
};
// GET /wishlist/get
export const getWishlistByUserIdController = async (req, res) => {
    try {
        // Allow both: logged-in user OR explicit userId param
        const userId = req.params.userId || req.user?.id;

        if (!userId) {
            return APIResponse.errorResponse(
                res,
                "User ID is required",
                400
            );
        }

        const wishlist = await WishlistModal.findOne({ userId })
            .populate("books.bookId");

        if (!wishlist || wishlist.books.length === 0) {
            return APIResponse.successResponse(
                res,
                { books: [] },
                "Wishlist is empty",
                200
            );
        }

        return APIResponse.successResponse(
            res,
            wishlist,
            "Wishlist fetched successfully",
            200
        );

    } catch (error) {
        return APIResponse.errorResponse(
            res,
            error?.message || error,
            500
        );
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
