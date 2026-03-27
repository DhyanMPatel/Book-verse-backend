import CartModal from "../modal/cartModel.js";
import BookModal from "../modal/bookModal.js";
import APIResponse from "../utils/APIResponse.js";
import { CartDataOrganizer } from "../halpers/cartHelper.js";

export const getCartController = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await CartModal.findOne({ userId });

        if (!cart) {
            return APIResponse.successResponse(res, { items: [] }, "Cart is empty", 200);
        }
        const cartData = CartDataOrganizer(cart);

        APIResponse.successResponse(res, cartData, "Cart fetched successfully", 200);
    } catch (error) {
        APIResponse.errorResponse(res, error?.message || error, 500);
    }
};

export const addItemToCartController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { bookId, quantity } = req.body;

        if (!bookId || !quantity || quantity < 1) {
            return APIResponse.errorResponse(res, "Book ID and valid quantity are required", 400);
        }

        // Check if book exists
        const book = await BookModal.findById(bookId);
        if (!book) {
            return APIResponse.errorResponse(res, "Book not found", 404);
        }

        // Find or create cart
        let cart = await CartModal.findOne({ userId });
        if (!cart) {
            cart = new CartModal({ userId, items: [] });
        }

        // Check if item already exists
        const existingItemIndex = cart.items.findIndex(item => item.bookId.toString() === bookId);

        if (existingItemIndex > -1) {
            // Update quantity
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            cart.items.push({
                bookId,
                title: book.title,
                price: book.price,
                quantity
            });
        }

        await cart.save();

        const cartData = CartDataOrganizer(cart)

        APIResponse.successResponse(res, cartData, "Item added to cart successfully", 200);
    } catch (error) {
        if (error.code === 11000) {
            return APIResponse.errorResponse(res, "Cart already exists for this user", 400);
        }
        APIResponse.errorResponse(res, error?.message || error, 500);
    }
};

export const updateCartItemController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { bookId, quantity } = req.body;

        if (!bookId || !quantity || quantity < 1) {
            return APIResponse.errorResponse(res, "Book ID and valid quantity are required", 400);
        }

        const cart = await CartModal.findOne({ userId });
        if (!cart) {
            return APIResponse.errorResponse(res, "Cart not found", 404);
        }

        const itemIndex = cart.items.findIndex(item => item.bookId.toString() === bookId);
        if (itemIndex === -1) {
            return APIResponse.errorResponse(res, "Item not found in cart", 404);
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        const cartData = CartDataOrganizer(cart)

        APIResponse.successResponse(res, cartData, "Cart item updated successfully", 200);
    } catch (error) {
        APIResponse.errorResponse(res, error?.message || error, 500);
    }
};

export const removeCartItemController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { bookId } = req.params;

        if (!bookId) {
            return APIResponse.errorResponse(res, "Book ID is required", 400);
        }

        const cart = await CartModal.findOne({ userId });
        if (!cart) {
            return APIResponse.errorResponse(res, "Cart not found", 404);
        }
        const removedCartItem = cart.items.some((item) => item.bookId.toString() === bookId);

        if (!removedCartItem) {
            return APIResponse.errorResponse(res, "Item not found in cart", 404);
        }

        cart.items = cart.items.filter(item => item.bookId.toString() !== bookId);
        await cart.save();

        const cartData = CartDataOrganizer(cart)

        APIResponse.successResponse(res, cartData, "Item removed from cart successfully", 200);
    } catch (error) {
        APIResponse.errorResponse(res, error?.message || error, 500);
    }
};

export const clearCartController = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await CartModal.deleteOne({ userId });
        if (!cart) {
            return APIResponse.successResponse(res, null, "Cart not found", 200);
        }

        APIResponse.successResponse(res, null, "Cart cleared successfully", 200);
    } catch (error) {
        APIResponse.errorResponse(res, error?.message || error, 500);
    }
};