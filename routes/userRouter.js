import express from 'express';
import { getAllUsers } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.route("/").get(authenticateToken, getAllUsers);

export default userRouter;