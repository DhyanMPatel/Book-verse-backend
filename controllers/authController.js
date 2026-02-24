import APIResponse from "../utils/APIResponse.js";
import UserModal from "../modal/userModal.js"
import bcrypt from "bcryptjs";

export const loginUserController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return APIResponse.errorResponse(res, "Email and password are required", 400)
        }

        console.log(email, "Email")
        console.log(password, "Password")

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