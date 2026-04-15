import express from 'express';
import { getAllUsers,createUser,deleteUser,updateUser,getUserById,changePassword, } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const userRouter = express.Router();

// Get all users
//End point --> /user/
userRouter.route("/").get(authenticateToken, getAllUsers);

// Get single user by ID
//End point --> /user/:id
userRouter.get("/:id", authenticateToken, getUserById);

// Create a user
// End point --> /user/create
userRouter.post("/create", createUser);

// Delete an user
// End point --> /user/delete/:id
userRouter.delete("/delete/:id", authenticateToken, deleteUser);

// Update an user
// End point --> /user/update/:id
userRouter.patch("/update/:id", authenticateToken, updateUser);

// Change password
// End point --> /user/change-password
userRouter.put("/change-password", authenticateToken, changePassword);

// userRouter.get("/admin/user-stats/:userId",authenticateToken,getUserStatsController);


export default userRouter;