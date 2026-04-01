import { razorpay } from '../config/razorPay.js';
import APIResponse from '../utils/APIResponse.js';

export const createOrderController = async (req, res) => {
    try {
        const { userId, cartItems, totalAmount } = req.body;

        if (!userId || !cartItems || !totalAmount) {
            return APIResponse.errorResponse(res, "Missing required fields: userId, cartItems, totalAmount", 400);
        }
        const options = {
            amount: totalAmount * 100, // Amount in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        APIResponse.successResponse(res, { orderId: order.id, amount: order.amount }, "Order created successfully", 200);


        // Implement order creation logic here
    } catch (err) {
        console.error("Order creation error:", err);
        return APIResponse.errorResponse(res, "Internal server error during order creation", 500)
    }
}

export const verifyPaymentController = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        console.log(razorpay_order_id, "Order Id, ", razorpay_payment_id, "Payment Id, ", razorpay_signature, "Signature")


    } catch (err) {
        console.error("Payment verification error:", err);
        return APIResponse.errorResponse(res, "Internal server error during payment verification", 500)
    }
}