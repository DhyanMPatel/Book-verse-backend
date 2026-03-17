import express from 'express';
import {
    createCategoryController,
    getAllCategoriesController,
    getCategoryByIdController,
    updateCategoryController,
    deleteCategoryController
} from "../controllers/categoryController.js";

import { authenticateToken } from '../middleware/authMiddleware.js';

const CategoryRouter = express.Router();

// Get all categories & create category
CategoryRouter.route("/")
    .get(authenticateToken, getAllCategoriesController)
    .post(authenticateToken, createCategoryController);

// Get, Update, Delete single category
CategoryRouter.route("/:categoryId")
    .get(authenticateToken, getCategoryByIdController)
   
    .patch(authenticateToken, updateCategoryController)
    .delete(authenticateToken, deleteCategoryController);

export default CategoryRouter;