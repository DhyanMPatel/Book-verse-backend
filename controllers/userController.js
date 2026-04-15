import UserModal from "../modal/userModal.js";
import WishlistModal from "../modal/wishlistModel.js";
import APIResponse from "../utils/APIResponse.js";
import bcrypt from "bcryptjs";

//get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModal.find();

    if (!users) {
      return APIResponse.errorResponse(res, "Users not found", 404);
    }

    if (users.length === 0) {
      return APIResponse.errorResponse(res, "No users found", 404);
    }

    const userData = users.map((user) => {
      return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        phone: user.phone,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });

    APIResponse.successResponse(
      res,
      userData,
      "Users fetched successfully",
      200,
    );
  } catch (error) {
    console.log(error);
    APIResponse.errorResponse(res, "Internal Server Error", 500);
  }
};

// Get single user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔹 Validate ID
    if (!id) {
      return APIResponse.errorResponse(
        res,
        "User ID is required",
        400
      );
    }

    // 🔹 Find user
    const user = await UserModal.findById(id);

    if (!user) {
      return APIResponse.errorResponse(
        res,
        "User not found",
        404
      );
    }

    const wishlist = await WishlistModal.findOne({ userId: user._id })


    // 🔹 Format response (same style as getAllUsers)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      phone: user.phone,
      wishlist: wishlist?.books,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return APIResponse.successResponse(
      res,
      userData,
      "User fetched successfully",
      200
    );

  } catch (error) {
    console.log("GET USER ERROR:", error);
    return APIResponse.errorResponse(
      res,
      error.message || "Internal Server Error",
      500
    );
  }
}; 

// Create an user
export const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // 👉 Get logged-in admin ID (same as book controller)
    const userId = req.user?.id;

    // 🔹 Validate required fields
    if (!name || !email || !password) {
      return APIResponse.errorResponse(
        res,
        "Name, email and password are required",
        400
      );
    }

    // 🔹 Check if user already exists
    const existingUser = await UserModal.findOne({ email });
    if (existingUser) {
      return APIResponse.errorResponse(
        res,
        "User already exists",
        409
      );
    }

    // 🔹 Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 🔹 Create user (same pattern as book)
    const newUser = new UserModal({
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || "user",
      createdBy: userId,   // optional (if in schema)
      updatedBy: userId,   // optional (if in schema)
    });

    const savedUser = await newUser.save();

    // 🔹 Format response (same style as book)
    APIResponse.successResponse(
      res,
      {
        user: {
          id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
          role: savedUser.role,
          isActive: savedUser.isActive,
          phone: savedUser.phone,
          createdAt: savedUser.createdAt,
          updatedAt: savedUser.updatedAt,
        },
      },
      "User created successfully",
      201
    );

  } catch (error) {
    console.error("Error creating user:", error);
    APIResponse.errorResponse(res, error.message, 500);
  }
};

// Detete an user 
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // 👉 Logged-in admin ID (optional, for tracking)
    const userId = req.user?.id;

    // 🔹 Validate ID
    if (!id) {
      return APIResponse.errorResponse(
        res,
        "User ID is required",
        400
      );
    }

    // 🔹 Find user
    const user = await UserModal.findById(id);

    if (!user) {
      return APIResponse.errorResponse(
        res,
        "User not found",
        404
      );
    }

    // 🔹 Delete user
    await UserModal.findByIdAndDelete(id);

    // 🔹 Response (same style as your create)
    APIResponse.successResponse(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        deletedBy: userId, // optional
      },
      "User deleted successfully",
      200
    );

  } catch (error) {
    console.error("Error deleting user:", error);
    APIResponse.errorResponse(res, error.message, 500);
  }
};

//Update an user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // 👉 Logged-in user/admin ID
    const userId = req.user?.id;

    const { name, email, password, phone, role, isActive } = req.body;

    // 🔹 Validate ID
    if (!id) {
      return APIResponse.errorResponse(
        res,
        "User ID is required",
        400
      );
    }

    // 🔹 Find user
    const user = await UserModal.findById(id);

    if (!user) {
      return APIResponse.errorResponse(
        res,
        "User not found",
        404
      );
    }

    // 🔹 Update fields (only if provided)
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (typeof isActive !== "undefined") user.isActive = isActive;

    // 🔹 If password provided → hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // 🔹 Track updater (if using in schema)
    user.updatedBy = userId;

    const updatedUser = await user.save();

    // 🔹 Response
    APIResponse.successResponse(
      res,
      {
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          isActive: updatedUser.isActive,
          phone: updatedUser.phone,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
        },
      },
      "User updated successfully",
      200
    );

  } catch (error) {
    console.error("Error updating user:", error);
    APIResponse.errorResponse(res, error.message, 500);
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    // 🔹 Validate required fields
    if (!currentPassword || !newPassword) {
      return APIResponse.errorResponse(
        res,
        "Current password and new password are required",
        400
      );
    }

    // 🔹 Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return APIResponse.errorResponse(
        res,
        "New password must be at least 8 characters and include uppercase, lowercase, number, and special character",
        400
      );
    }

    // 🔹 Prevent reuse of same password
    if (currentPassword === newPassword) {
      return APIResponse.errorResponse(
        res,
        "New password must be different from current password",
        400
      );
    }

    // 🔹 Fetch user WITH password (select: false in schema, so explicit select needed)
    const user = await UserModal.findById(userId).select("+password");

    if (!user) {
      return APIResponse.errorResponse(res, "User not found", 404);
    }

    // 🔹 Verify current password - THIS CHECKS IF CURRENT PASSWORD IS CORRECT
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return APIResponse.errorResponse(res, "Current password is incorrect", 401);
    }

    // 🔹 Hash new password
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    user.updatedBy = userId;

    await user.save();

    return APIResponse.successResponse(
      res,
      null,
      "Password changed successfully",
      200
    );

  } catch (error) {
    console.error("Error changing password:", error);
    return APIResponse.errorResponse(res, error.message || "Internal Server Error", 500);
  }
};

