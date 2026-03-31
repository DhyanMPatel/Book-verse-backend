import React from 'react'
import APIResponse from '../utils/APIResponse';
import Razorpay from 'razorpay';
import { razorpay } from '../config/razorPay';

export const orderController = async (req, res) => {
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

        APIResponse.successResponse(res, { orderId: order.id }, "Order created successfully", 200);


        // Implement order creation logic here
    } catch (err) {
        console.error("Order creation error:", err);
        return APIResponse.errorResponse(res, "Internal server error during order creation", 500)
    }
}

