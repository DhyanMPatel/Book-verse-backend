import express from 'express';
import bodyParser from 'body-parser';
import { createOrderController, verifyPaymentController, getUserOrdersController, razorpayWebhookController } from '../controllers/orderController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const orderRouter = express.Router();

orderRouter.route("/create").post(authenticateToken, createOrderController);
orderRouter.route("/verify-payment").post(authenticateToken, verifyPaymentController);
orderRouter.route("/user-orders").get(authenticateToken, getUserOrdersController);
orderRouter.route("/webhook").post(bodyParser.raw({ type: 'application/json' }), razorpayWebhookController);

export default orderRouter;