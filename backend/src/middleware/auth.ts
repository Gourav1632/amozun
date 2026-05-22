import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

export interface AuthPayload {
    userId: string
}

// extend express request to include user info
declare global {
    namespace Express {
        interface Request {
            userId?: string
        }
    }
}

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies?.token;
    if (!token) {
        throw new AppError('Not authenticated. Please login.', 401);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
        req.userId = decoded.userId;
        next();
    } catch {
        throw new AppError('Invalid or expired token.', 401);
    }
};