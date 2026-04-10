// import express from 'express';
// import {
//     getAllCouponsController,
//     getCouponByIdController,
//     validateCouponController,
//     createCouponController,
//     updateCouponController,
//     deleteCouponController,
//     applyCouponController
// } from "../controllers/couponController.js";

// import { authenticateToken } from '../middleware/authMiddleware.js';

// const couponRouter = express.Router();

// // Get all coupons (with filters)
// couponRouter.get('/list', authenticateToken, getAllCouponsController);

// // Get coupon by ID
// couponRouter.get('/:couponId', authenticateToken, getCouponByIdController);

// // Validate coupon by code (no auth required - for checkout)
// couponRouter.get('/validate/:couponCode', validateCouponController);

// // Create coupon (Admin only - optional: add admin middleware)
// couponRouter.post('/create', authenticateToken, createCouponController);

// // Update coupon (Admin only - optional: add admin middleware)
// couponRouter.patch("/update/:couponId", authenticateToken, updateCouponController);

// // Delete coupon (Admin only - optional: add admin middleware)
// couponRouter.delete('/delete/:couponId', authenticateToken, deleteCouponController);

// // Apply coupon (increment usage count)
// couponRouter.post('/apply', authenticateToken, applyCouponController);

// export default couponRouter;




import express from "express";
import {
  getAllCouponsController,
  getCouponByIdController,
  validateCouponController,
  createCouponController,
  updateCouponController,
  deleteCouponController,
  applyCouponController,
} from "../controllers/couponController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const couponRouter = express.Router();

// FIX: static/specific routes MUST come before dynamic /:param routes
// otherwise Express matches "list", "validate", "create", "apply" as couponId

couponRouter.get("/list", authenticateToken, getAllCouponsController);

// FIX: must be above /:couponId — "validate" was being caught as a couponId
couponRouter.get("/validate/:couponCode", validateCouponController);

couponRouter.post("/create", authenticateToken, createCouponController);
couponRouter.post("/apply", authenticateToken, applyCouponController);

// Dynamic routes come last
couponRouter.get("/:couponId", authenticateToken, getCouponByIdController);
couponRouter.patch("/update/:couponId", authenticateToken, updateCouponController);
couponRouter.delete("/delete/:couponId", authenticateToken, deleteCouponController);

export default couponRouter;