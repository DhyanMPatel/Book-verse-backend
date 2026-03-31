import express from 'express';
import { orderController } from '../controllers/orderController';

const orderRouter = express.Router();

orderRouter.route("/create").post(orderController)

export default orderRouter;