import jwt from "jsonwebtoken";
import UserModal from "../modal/userModal.js";

export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false,
                message: "Access token is required" 
            });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: "Access token is required" 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await UserModal.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid token - user not found" 
            });
        }

        if (!user.isActive) {
            return res.status(401).json({ 
                success: false,
                message: "Account is deactivated" 
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false,
                message: "Invalid token" 
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                message: "Token expired" 
            });
        }

        return res.status(500).json({ 
            success: false,
            message: "Internal server error during authentication" 
        });
    }
};

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                success: false,
                message: "Authentication required" 
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false,
                message: "Access denied - insufficient permissions" 
            });
        }

        next();
    };
};
