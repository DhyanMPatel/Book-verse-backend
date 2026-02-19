import express from 'express';
import authRouter from './routes/authRouter.js';


const appRouter = express();

appRouter.use("/auth", authRouter);
// appRouter.use("/user", userRouter);

export default appRouter;