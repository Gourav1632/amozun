import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
export const authenticate = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        throw new AppError('Not authenticated. Please login.', 401);
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    }
    catch {
        throw new AppError('Invalid or expired token.', 401);
    }
};
//# sourceMappingURL=auth.js.map