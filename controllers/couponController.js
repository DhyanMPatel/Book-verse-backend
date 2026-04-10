
import CouponModel from "../modal/couponModel.js";
import APIResponse from "../utils/APIResponse.js";

// Helper: validate coupon data
const validateCouponFields = ({
  couponCode,
  discount,
  discountType,
  categoryId,
  validTillDate,
}) => {
  if (
    !couponCode ||
    discount === undefined ||
    !discountType ||
    !categoryId ||
    !validTillDate
  ) {
    return "Required fields: couponCode, discount, discountType, categoryId, validTillDate";
  }

  const parsedDate = new Date(validTillDate);
  if (isNaN(parsedDate.getTime())) {
    return "validTillDate must be a valid date";
  }

  if (parsedDate <= new Date()) {
    return "Valid till date must be in the future";
  }

  if (discountType === "percentage" && (discount < 0 || discount > 100)) {
    return "Percentage discount must be between 0 and 100";
  }

  if (discountType === "fixed" && discount < 0) {
    return "Fixed discount cannot be less than 0";
  }

  return null;
};

// Get all coupons
export const getAllCouponsController = async (req, res) => {
  try {
    const { categoryId } = req.query;

    const filter = {};
    if (categoryId) filter.categoryId = categoryId;

    const coupons = await CouponModel.find(filter)
      .populate("categoryId", "name")
      .sort({ createdAt: -1 });

    return APIResponse.successResponse(
      res,
      { coupons, count: coupons.length },
      "Coupons fetched successfully",
      200
    );
  } catch (error) {
    return APIResponse.errorResponse(res, error?.message || error, 500);
  }
};

// Get coupon by ID
export const getCouponByIdController = async (req, res) => {
  try {
    const { couponId } = req.params;

    const coupon = await CouponModel.findById(couponId).populate(
      "categoryId",
      "name"
    );

    if (!coupon) {
      return APIResponse.errorResponse(res, "Coupon not found", 404);
    }

    return APIResponse.successResponse(
      res,
      coupon,
      "Coupon fetched successfully",
      200
    );
  } catch (error) {
    return APIResponse.errorResponse(res, error?.message || error, 500);
  }
};

// Validate coupon without using it
export const validateCouponController = async (req, res) => {
  try {
    const { couponCode } = req.params;

    if (!couponCode) {
      return APIResponse.errorResponse(res, "Coupon code is required", 400);
    }

    const coupon = await CouponModel.findOne({
      couponCode: couponCode.toUpperCase(),
      validTillDate: { $gt: new Date() },
    }).populate("categoryId", "name");

    if (!coupon) {
      return APIResponse.errorResponse(res, "Coupon is invalid or expired", 404);
    }

    if (coupon.usageLimit !== null && coupon.timesUsed >= coupon.usageLimit) {
      return APIResponse.errorResponse(
        res,
        "Coupon usage limit exceeded",
        400
      );
    }

    return APIResponse.successResponse(
      res,
      {
        couponCode: coupon.couponCode,
        discount: coupon.discount,
        discountType: coupon.discountType,
        category: coupon.categoryId,
        validTillDate: coupon.validTillDate,
      },
      "Coupon is valid",
      200
    );
  } catch (error) {
    return APIResponse.errorResponse(res, error?.message || error, 500);
  }
};

// Create coupon
export const createCouponController = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return APIResponse.errorResponse(res, "Request body is missing", 400);
    }

    const {
      couponCode,
      discount,
      discountType = "fixed",
      categoryId,
      validTillDate,
      usageLimit,
      description,
    } = req.body;

    const validationError = validateCouponFields({
      couponCode,
      discount,
      discountType,
      categoryId,
      validTillDate,
    });

    if (validationError) {
      return APIResponse.errorResponse(res, validationError, 400);
    }

    const existingCoupon = await CouponModel.findOne({
      couponCode: couponCode.toUpperCase(),
    });

    if (existingCoupon) {
      return APIResponse.errorResponse(res, "Coupon code already exists", 409);
    }

    const newCoupon = new CouponModel({
      couponCode: couponCode.toUpperCase(),
      discount,
      discountType,
      categoryId,
      validTillDate: new Date(validTillDate),
      usageLimit: usageLimit ?? null,
      description: description ?? "",
    });

    const savedCoupon = await newCoupon.save();

    return APIResponse.successResponse(
      res,
      savedCoupon,
      "Coupon created successfully",
      201
    );
  } catch (error) {
    if (error.code === 11000) {
      return APIResponse.errorResponse(res, "Coupon code already exists", 409);
    }
    return APIResponse.errorResponse(res, error?.message || error, 500);
  }
};

// Update coupon
export const updateCouponController = async (req, res) => {
  try {
    const { couponId } = req.params;

    if (!req.body || Object.keys(req.body).length === 0) {
      return APIResponse.errorResponse(res, "Request body is required", 400);
    }

    const {
      couponCode,
      discount,
      discountType,
      categoryId,
      validTillDate,
      usageLimit,
      description,
    } = req.body;

    const coupon = await CouponModel.findById(couponId);
    if (!coupon) {
      return APIResponse.errorResponse(res, "Coupon not found", 404);
    }

    // Update only provided fields
    if (couponCode !== undefined) coupon.couponCode = couponCode.toUpperCase();
    if (discount !== undefined) coupon.discount = discount;
    if (discountType !== undefined) coupon.discountType = discountType;
    if (categoryId !== undefined) coupon.categoryId = categoryId;
    if (validTillDate !== undefined)
      coupon.validTillDate = new Date(validTillDate);
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
    if (description !== undefined) coupon.description = description;

    const validationError = validateCouponFields({
      couponCode: coupon.couponCode,
      discount: coupon.discount,
      discountType: coupon.discountType,
      categoryId: coupon.categoryId,
      validTillDate: coupon.validTillDate,
    });

    if (validationError) {
      return APIResponse.errorResponse(res, validationError, 400);
    }

    const updatedCoupon = await coupon.save();

    return APIResponse.successResponse(
      res,
      updatedCoupon,
      "Coupon updated successfully",
      200
    );
  } catch (error) {
    if (error.code === 11000) {
      return APIResponse.errorResponse(res, "Coupon code already exists", 409);
    }
    return APIResponse.errorResponse(res, error?.message || error, 500);
  }
};

// Delete coupon
export const deleteCouponController = async (req, res) => {
  try {
    const { couponId } = req.params;

    const coupon = await CouponModel.findByIdAndDelete(couponId);

    if (!coupon) {
      return APIResponse.errorResponse(res, "Coupon not found", 404);
    }

    return APIResponse.successResponse(
      res,
      coupon,
      "Coupon deleted successfully",
      200
    );
  } catch (error) {
    return APIResponse.errorResponse(res, error?.message || error, 500);
  }
};

// Apply coupon (increments timesUsed)
export const applyCouponController = async (req, res) => {
  try {
    const { couponCode } = req.body;

    if (!couponCode) {
      return APIResponse.errorResponse(res, "Coupon code is required", 400);
    }

    const coupon = await CouponModel.findOne({
      couponCode: couponCode.toUpperCase(),
      validTillDate: { $gt: new Date() },
    });

    if (!coupon) {
      return APIResponse.errorResponse(res, "Coupon is invalid or expired", 404);
    }

    if (coupon.usageLimit !== null && coupon.timesUsed >= coupon.usageLimit) {
      return APIResponse.errorResponse(
        res,
        "Coupon usage limit exceeded",
        400
      );
    }

    coupon.timesUsed += 1;
    const appliedCoupon = await coupon.save();

    return APIResponse.successResponse(
      res,
      {
        couponCode: appliedCoupon.couponCode,
        discount: appliedCoupon.discount,
        discountType: appliedCoupon.discountType,
        timesUsed: appliedCoupon.timesUsed,
      },
      "Coupon applied successfully",
      200
    );
  } catch (error) {
    return APIResponse.errorResponse(res, error?.message || error, 500);
  }
};