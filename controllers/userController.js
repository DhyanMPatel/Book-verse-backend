import UserModal from "../modal/userModal.js";
import APIResponse from "../utils/APIResponse.js";

export const getAllUsers =  async (req, res) => {
    try{
        const users = await UserModal.find();

        if(!users){
            return APIResponse.errorResponse(res, "Users not found", 404);
        }

        if(users.length === 0){
            return APIResponse.errorResponse(res, "No users found", 404);
        }

        const userData = users.map((user) => {
            return {
                id:user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                phone: user.phone,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            }
        })

        APIResponse.successResponse(res, userData, "Users fetched successfully", 200);
    }
    catch(error){
        console.log(error);
        APIResponse.errorResponse(res, "Internal Server Error", 500);
    }
}