import APIResponse from "../utils/APIResponse.js";

export const loginUserController = async (req, res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});

        if(!user) {
            return APIResponse.errorResponse(res, {}, "User not found", 404)
        }
        
        return APIResponse.successResponse(res, user, "Login successful", 200)
                
    } catch(err) {
        return APIResponse.errorResponse(res, {}, "User not found", 404)
    }
}

export const registerUserController = async (req, res) => {
    try{
        const {email, password, name, phone} = req.body;
        
        const user = await User.create({email, password, name, phone});

        if(!user) {
            return APIResponse.errorResponse(res, {}, "User not found", 404)
        }
        
        return APIResponse.successResponse(res, user, "Login successful", 200)
                
    } catch(err) {
        return APIResponse.errorResponse(res, {}, "User not found", 404)
    }
}