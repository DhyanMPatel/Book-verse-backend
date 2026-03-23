import express from "express";
import { createBookController, getBookController, getBookDetailsController ,deleteBookController} from "../controllers/bookController.js";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware.js";
import { upload } from "../utils/fileUpload.js";
import ReviewRouter from "./reviewRouter.js";
import { processFilePaths } from "../halpers/relativePathGetter.js";

const bookRouter = express.Router();

// Public route - anyone can view books
bookRouter.route("/all").get(getBookController);

// Protected routes - authentication required
bookRouter.route("/create").post(authenticateToken, upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'file', maxCount: 1 }
]), processFilePaths, authorizeRoles('admin'), createBookController);
// bookRouter.route("/update/:id").put(authenticateToken, authorizeRoles('admin'), updateBookController);

bookRouter.route("/delete/:id").delete(authenticateToken, authorizeRoles('admin'), deleteBookController);


// Book Details routes
bookRouter.route("/details/:id").get(getBookDetailsController)


export default bookRouter;
