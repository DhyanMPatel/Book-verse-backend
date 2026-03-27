import express from 'express';
import {
    createCategoryController,
    getAllCategoriesController,
    getCategoryByIdController,
    updateCategoryController,
    deleteCategoryController
} from "../controllers/categoryController.js";

import { authenticateToken } from '../middleware/authMiddleware.js';

const categoryRouter = express.Router();

// Get all categories & create category
categoryRouter.route("/")
    .get(authenticateToken, getAllCategoriesController)
    .post(authenticateToken, createCategoryController);

// Get, Update, Delete single category
categoryRouter.route("/:categoryId")
    .get(authenticateToken, getCategoryByIdController)

    .patch(authenticateToken, updateCategoryController)
    .delete(authenticateToken, deleteCategoryController);

export default categoryRouter;