import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "User ID is required"]
    },
    razorpayOrderId: {
        type: String,
        required: [true, "Razorpay Order ID is required"],
        unique: true
    },
    razorpayPaymentId: {
        type: String,
        // required: [true, "Razorpay Payment ID is required"] // Set after payment
    },
    razorpaySignature: {
        type: String,
        // required: [true, "Razorpay Signature is required"] // Set after payment
    },
    totalAmount: {
        type: Number,
        required: [true, "Total amount is required"],
        min: [0, "Total amount cannot be negative"]
    },
    currency: {
        type: String,
        default: "INR"
    },
    status: {
        type: String,
        enum: ["pending", "paid", "failed", "completed"],
        default: "pending"
    },
    items: [{
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "books",
            required: [true, "Book ID is required"]
        },
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            maxlength: [200, "Title cannot exceed 200 characters"]
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"]
        },
        quantity: {
            type: Number,
            required: [true, "Quantity is required"],
            min: [1, "Quantity must be at least 1"]
        }
    }]
}, { timestamps: true });

// Index for optimization
orderSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Order", orderSchema);