import express from 'express';
import { createOrderController, verifyPaymentController } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.route("/create").post(createOrderController)
orderRouter.route("/verify-payment").post(verifyPaymentController)

export default orderRouter;