import express from 'express';
import authRouter from './routes/authRouter.js';
import bookRouter from './routes/bookRouter.js';
import reviewRouter from './routes/reviewRouter.js';
import categoryRouter from './routes/categoryRoutes.js';
import userRouter from './routes/userRouter.js';
import cartRouter from './routes/cartRouter.js';
import orderRouter from './routes/orderRouter.js';


const appRouter = express();

appRouter.use("/auth", authRouter);
appRouter.use("/books", bookRouter);
appRouter.use("/reviews", reviewRouter);
appRouter.use("/categories", categoryRouter);
appRouter.use("/user", userRouter);
appRouter.use("/cart", cartRouter);
appRouter.use("/order", orderRouter);


export default appRouter;