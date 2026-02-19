import express from 'express';
import { loginUserController, registerUserController } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.route("/login").post(loginUserController)
authRouter.route("/register").post(registerUserController)

export default authRouter;