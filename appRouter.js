import express from 'express';
import authRouter from './routes/authRouter.js';
import bookRouter from './routes/bookRouter.js';


const appRouter = express();

appRouter.use("/auth", authRouter);
appRouter.use("/books", bookRouter);
// appRouter.use("/user", userRouter);

export default appRouter;