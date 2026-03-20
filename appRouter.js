import express from 'express';
import authRouter from './routes/authRouter.js';
import bookRouter from './routes/bookRouter.js';
import ReviewRouter from './routes/reviewRouter.js';
import userRouter from './routes/userRouter.js';


const appRouter = express();

appRouter.use("/auth", authRouter);
appRouter.use("/books", bookRouter);
appRouter.use("/reviews", ReviewRouter);
appRouter.use("/user", userRouter);


export default appRouter;