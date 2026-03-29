import APIResponse from "../utils/APIResponse.js";
import UserModal from "../modal/userModal.js"
import bcrypt from "bcryptjs";
import { ResetPasswordTokenGenerator } from "../halpers/resetPasswordTokenGenerator.js";
import emailService from "../services/emailService.js";

export const loginUserController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return APIResponse.errorResponse(res, "Email and password are required", 400)
        }

        // Include password field in query since it has select: false
        const user = await UserModal.findOne({ email }).select('+password');

        if (!user) {
            return APIResponse.errorResponse(res, "User not found", 404)
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return APIResponse.errorResponse(res, "Invalid credentials", 401)
        }

        // Generate JWT tokens
        const authToken = user.generateAuthToken();
        const refreshToken = user.generateRefreshToken();

        // Remove password from response for security
        const userResponse = user.toObject();
        delete userResponse.password;

        // Set HTTP-only cookie for refresh token
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        return APIResponse.successResponse(res, {
            user: userResponse,
            authToken,
            refreshToken
        }, "Login successful", 200)

    } catch (err) {
        console.error("Login error:", err);
        return APIResponse.errorResponse(res, "Internal server error during login", 500)
    }
}

export const registerUserController = async (req, res) => {
    try {
        const { email, password, name, phone } = req.body;

        if (!email || !password || !name) {
            return APIResponse.errorResponse(res, "Email, password, and name are required", 400)
        }

        // Check if user already exists
        const existingUser = await UserModal.findOne({ email });
        if (existingUser) {
            return APIResponse.errorResponse(res, "User with this email already exists", 409)
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await UserModal.create({
            email,
            password: hashedPassword,
            name,
            phone
        });

        if (!user) {
            return APIResponse.errorResponse(res, "Failed to create user", 500)
        }

        // Generate JWT tokens for immediate login
        const authToken = user.generateAuthToken();
        const refreshToken = user.generateRefreshToken();

        // Remove password from response for security
        const userResponse = user.toObject();
        delete userResponse.password;

        // Set HTTP-only cookie for refresh token
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        return APIResponse.successResponse(res, {
            user: userResponse,
            authToken,
            refreshToken
        }, "User registered successfully", 201)

    } catch (err) {
        console.error("Registration error:", err);
        if (err.code === 11000) {
            return APIResponse.errorResponse(res, "User with this email already exists", 409)
        }
        return APIResponse.errorResponse(res, "Internal server error during registration", 500)
    }
}

export const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return APIResponse.errorResponse(res, "Email is required", 400);
        }

        const user = await UserModal.findOne({ email });

        if (!user) {
            return APIResponse.errorResponse(res, "User with given email not found", 404);
        }
        const { token, tokenExpire } = ResetPasswordTokenGenerator();

        if (!token || !tokenExpire) {
            return APIResponse.errorResponse(res, "Failed to generate reset password token", 500);
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpire = tokenExpire;

        await user.save();

        // Construct reset link with frontend URL
        const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
        const resetLink = `${frontendURL}/reset-password/${token}`;

        // Send reset password email
        const emailResult = await emailService.sendResetPasswordEmail(
            user.email,
            user.name,
            token,
            resetLink
        );

        if (!emailResult.success) {
            console.error("Failed to send reset email:", emailResult.error);
            return APIResponse.errorResponse(res, "Failed to send reset email. Please try again later", 500);
        }

        return APIResponse.successResponse(res, null, "Reset password email sent successfully. Please check your inbox.", 200)

    } catch (err) {
        console.error("Forgot password error:", err);
        return APIResponse.errorResponse(res, "Internal server error during Forgot Password", 500)
    }
}

export const resetPasswordController = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const { token } = req.params;

        if (!newPassword || !token) {
            return APIResponse.errorResponse(res, "New password or token are required", 400);
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 12);

        const user = await UserModal.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() }
        })

        if (!user) {
            return APIResponse.errorResponse(res, "Invalid or expired reset token", 400);
        }

        user.password = hashedNewPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return APIResponse.successResponse(res, null, "Password reset successful", 200);


    } catch (err) {
        console.error("Reset password error:", err);
        return APIResponse.errorResponse(res, "Internal server error during Reset Password", 500)
    }
}