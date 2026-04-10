
import mongoose from "mongoose";

const couponSchema = mongoose.Schema(
  {
    couponCode: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      trim: true,
      uppercase: true,
      minlength: [3, "Coupon code must be at least 3 characters"],
      maxlength: [20, "Coupon code cannot exceed 20 characters"],
    },
    discount: {
      type: Number,
      required: [true, "Discount amount is required"],
      min: [0, "Discount cannot be less than 0"],
      validate: {
        validator: function (value) {
          return (
            Number.isInteger(value) ||
            (value % 1 !== 0 && value.toString().split(".")[1].length <= 2)
          );
        },
        message: "Discount must be a valid number (up to 2 decimal places)",
      },
    },
    discountType: {
      type: String,
      enum: {
        values: ["fixed", "percentage"],
        message:
          "Discount type must be either 'fixed' (fixed amount) or 'percentage' (% off)",
      },
      default: "fixed",
      required: [true, "Discount type is required"],
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: [true, "Category is required"],
    },
    validTillDate: {
      type: Date,
      required: [true, "Valid till date is required"],
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: "Valid till date must be in the future",
      },
    },
    usageLimit: {
      type: Number,
      default: null,
    },
    timesUsed: {
      type: Number,
      default: 0,
      min: [0, "Times used cannot be negative"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
  },
  { timestamps: true }
);

// FIX: was referencing non-existent field "category" — corrected to "categoryId"
couponSchema.index({ couponCode: 1 });
couponSchema.index({ validTillDate: 1 });
couponSchema.index({ categoryId: 1 });

export default mongoose.model("Coupon", couponSchema);