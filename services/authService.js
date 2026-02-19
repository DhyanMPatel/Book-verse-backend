import UserModal from "../modal/userModal";
import APIResponse from "../utils/APIResponse";

class AuthService {

    // Register User Service
    static async registerUserService(userData) {
        try {
            const {email} = userData;

            const existingUser = await UserModal.findOne({email});
            if(existingUser) {
                return APIResponse.errorResponse(res,  "User already exists", 400);
            }

            const user = await UserModal.create(userData);

            if(!user) {
                return APIResponse.errorResponse(res, "User registration failed", 500);
            }

            const token = user.generateAuthToken();
            const refreshToken = user.generateRefreshToken();

            return {
                user: user.toObject(),
                token,
                refreshToken
            };
        } catch(err) {
            return {error: "User registration failed", details: err.message};
        }
    }

    // Login User Service
    static async loginUserService(email, password) {
        try {

        } catch(err) {
            return APIResponse.errorResponse(res, {}, "User not found", 404)
        }
    }
}