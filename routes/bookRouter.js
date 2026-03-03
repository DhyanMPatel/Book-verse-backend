import express from "express";
import { getBookController } from "../controllers/bookController.js";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware.js";

const bookRouter = express.Router();

// Public route - anyone can view books
bookRouter.route("/all").get(getBookController);

// Protected routes - authentication required
// bookRouter.route("/create").post(authenticateToken, authorizeRoles('admin'), createBookController);
// bookRouter.route("/update/:id").put(authenticateToken, authorizeRoles('admin'), updateBookController);
// bookRouter.route("/delete/:id").delete(authenticateToken, authorizeRoles('admin'), deleteBookController);

export default bookRouter;
