import express from 'express';
import authRouter from './routes/authRouter.js';
import bookRouter from './routes/bookRouter.js';
import ReviewRouter from './routes/reviewRouter.js';
import CategoryRouter from './routes/categoryRoutes.js';


const appRouter = express();

appRouter.use("/auth", authRouter);
appRouter.use("/books", bookRouter);
appRouter.use("/reviews", ReviewRouter);
appRouter.use("/categories",CategoryRouter)

// appRouter.use("/user", userRouter);

export default appRouter;