import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db/index.js";
import { AppError } from "../utils/AppError.js";
import { redisClient } from "../db/redis.js";
import { sendOtpEmail } from "../services/emailService.js";
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
export const sendSigupOTP = async (req, res) => {
    const { email } = req.body;
    if (!email)
        throw new AppError("Email is required.", 400);
    const existing = await db
        .selectFrom("users")
        .where("email", "=", email)
        .selectAll()
        .executeTakeFirst();
    if (existing) {
        throw new AppError("Email already registered.", 409);
    }
    const otp = generateOTP();
    await redisClient.setEx(`signup-otp:${email}`, 5 * 60, otp);
    await sendOtpEmail(email, otp);
    res.json({
        status: 'success',
        message: 'OTP sent to email.'
    });
};
export const signup = async (req, res) => {
    const { name, email, password, otp } = req.body;
    if (!name || !email || !password || !otp) {
        throw new AppError("Name, email, password and OTP are required.", 400);
    }
    // verify otp from redis
    const storedOTP = await redisClient.get(`signup-otp:${email}`);
    if (!storedOTP || storedOTP !== otp) {
        throw new AppError('Invalid or expire OTP.', 401);
    }
    await redisClient.del(`signup-otp:${email}`);
    const passwordHash = await bcrypt.hash(password, 12);
    // Create user, cart, and wishlist in sequence
    const user = await db
        .insertInto("users")
        .values({ name, email, password_hash: passwordHash })
        .returningAll()
        .executeTakeFirstOrThrow();
    await db.insertInto("carts").values({ user_id: user.id }).execute();
    await db.insertInto("wishlists").values({ user_id: user.id }).execute();
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    res.cookie("token", token, COOKIE_OPTIONS);
    res.status(201).json({
        status: "success",
        data: { id: user.id, name: user.name, email: user.email },
    });
};
export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new AppError("Email and password are required.", 400);
    }
    const user = await db
        .selectFrom("users")
        .where("email", "=", email)
        .selectAll()
        .executeTakeFirst();
    if (!user) {
        throw new AppError("Invalid email or password.", 401);
    }
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        throw new AppError("Invalid email or password.", 401);
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    res.cookie("token", token, COOKIE_OPTIONS);
    res.json({
        status: "success",
        data: { id: user.id, name: user.name, email: user.email },
    });
};
export const logout = (_req, res) => {
    res.clearCookie("token", COOKIE_OPTIONS);
    res.json({ status: "success", message: "Logged out" });
};
export const getMe = async (req, res) => {
    const user = await db
        .selectFrom("users")
        .where("id", "=", req.userId)
        .select(["id", "name", "email", "created_at"])
        .executeTakeFirst();
    if (!user) {
        throw new AppError("User not found.", 404);
    }
    res.json({ status: "success", data: user });
};
//# sourceMappingURL=authController.js.map