import express from 'express';
import { forgotPasswordController, loginUserController, registerUserController, resetPasswordController } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.route("/login").post(loginUserController)
authRouter.route("/register").post(registerUserController)
authRouter.route("/forgot-password").post(forgotPasswordController)
authRouter.route("/reset-password/:token").post(resetPasswordController)

export default authRouter;