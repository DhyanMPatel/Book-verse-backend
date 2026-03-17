import { CategoryModal } from "../modal/categoryModel.js";
import APIResponse from "../utils/APIResponse.js";
import mongoose from "mongoose";

// this 
// ✅ Get all categories (no pagination)
export const getAllCategoriesController = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const query = {
      category: { $regex: search, $options: "i" },
    };

    const categories = await CategoryModal.find(query)
      .select("_id category")
      .sort({ _id: -1 })
      .lean();

    return APIResponse.successResponse(
      res,
      { categories },
      "Categories fetched successfully",
      200
    );
  } catch (error) {
    return APIResponse.errorResponse(res, error.message, 500);
  }
};


// ✅ Get single category
export const getCategoryByIdController = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return APIResponse.errorResponse(res, "Invalid category ID", 400);
    }

    const category = await CategoryModal.findById(categoryId)
      .select("_id category");

    if (!category) {
      return APIResponse.errorResponse(res, "Category not found", 404);
    }

    return APIResponse.successResponse(
      res,
      category,
      "Category fetched successfully",
      200
    );
  } catch (error) {
    return APIResponse.errorResponse(res, error.message, 500);
  }
};


// ✅ Create category
export const createCategoryController = async (req, res) => {
  try {
    let { category } = req.body || {}; // ✅ FIX

    if (!category) {
      return APIResponse.errorResponse(res, "Category is required", 400);
    }

    category = category.trim().toLowerCase();

    // ✅ Case-insensitive duplicate check
    const existing = await CategoryModal.findOne({
      category: { $regex: `^${category}$`, $options: "i" },
    });

    if (existing) {
      return APIResponse.errorResponse(res, "Category already exists", 400);
    }

    const newCategory = new CategoryModal({ category });
    const savedCategory = await newCategory.save();

    return APIResponse.successResponse(
      res,
      { _id: savedCategory._id, category: savedCategory.category },
      "Category created successfully",
      201
    );
  } catch (error) {
    if (error.code === 11000) {
      return APIResponse.errorResponse(res, "Duplicate category", 400);
    }

    return APIResponse.errorResponse(res, error.message, 500);
  }
};


// ✅ Update category
export const updateCategoryController = async (req, res) => {
  try {
    const { categoryId } = req.params;
    let { category } = req.body || {}; // ✅ FIX

    if (!category) {
      return APIResponse.errorResponse(res, "Category is required", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return APIResponse.errorResponse(res, "Invalid category ID", 400);
    }

    const existing = await CategoryModal.findById(categoryId);

    if (!existing) {
      return APIResponse.errorResponse(res, "Category not found", 404);
    }

    category = category.trim().toLowerCase();

    // ✅ Prevent duplicate
    const duplicate = await CategoryModal.findOne({
      category: { $regex: `^${category}$`, $options: "i" },
      _id: { $ne: categoryId },
    });

    if (duplicate) {
      return APIResponse.errorResponse(res, "Category already exists", 400);
    }

    existing.category = category;

    const updated = await existing.save();

    return APIResponse.successResponse(
      res,
      { _id: updated._id, category: updated.category },
      "Category updated successfully",
      200
    );
  } catch (error) {
    return APIResponse.errorResponse(res, error.message, 500);
  }
};


// ✅ Delete category
export const deleteCategoryController = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return APIResponse.errorResponse(res, "Invalid category ID", 400);
    }

    const category = await CategoryModal.findById(categoryId);

    if (!category) {
      return APIResponse.errorResponse(res, "Category not found", 404);
    }

    await CategoryModal.deleteOne({ _id: categoryId });

    return APIResponse.successResponse(
      res,
      null,
      "Category deleted successfully",
      200
    );
  } catch (error) {
    return APIResponse.errorResponse(res, error.message, 500);
  }
};