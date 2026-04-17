import express from 'express';
import authRouter from './routes/authRouter.js';
import bookRouter from './routes/bookRouter.js';
import reviewRouter from './routes/reviewRouter.js';
import categoryRouter from './routes/categoryRoutes.js';
import userRouter from './routes/userRouter.js';
import cartRouter from './routes/cartRouter.js';
import orderRouter from './routes/orderRouter.js';
import wishlistRouter from './routes/wishlistRouter.js';
import couponRouter from './routes/couponRouter.js';
import APIResponse from './utils/APIResponse.js';


const appRouter = express();
appRouter.use("/wishlist", wishlistRouter);
appRouter.use("/coupons", couponRouter);
appRouter.use("/auth", authRouter);
appRouter.use("/books", bookRouter);
appRouter.use("/reviews", reviewRouter);
appRouter.use("/categories", categoryRouter);
appRouter.use("/user", userRouter);
appRouter.use("/cart", cartRouter);
appRouter.use("/order", orderRouter);

// Test route
appRouter.get("/test", (req, res) => {
    APIResponse.successResponse(res, null, "API is working fine!", 200);
});


export default appRouter;