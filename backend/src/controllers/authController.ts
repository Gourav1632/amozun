import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { db } from "../db/index.js";
import { AppError } from "../utils/AppError.js";
import { redisClient } from "../db/redis.js";
import { sendOtpEmail } from "../services/emailService.js";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true, // required for sameSite: 'none'
    sameSite: "none" as const, // allows cross-site cookies from Vercel to EC2
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const sendSigupOTP = async (
    req: Request,
    res: Response
) => {

    const { email } = req.body;

    if (!email) throw new AppError("Email is required.", 400);
    if (!/^\S+@\S+\.\S+$/.test(email)) throw new AppError("Invalid email format.", 400);

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
}

export const signup = async (req: Request, res: Response) => {
    const { name, email, password, otp } = req.body;

    if (!name || name.trim().length < 2) {
        throw new AppError("Name must be at least 2 characters.", 400);
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        throw new AppError("Invalid email format.", 400);
    }
    if (!password || password.length < 6 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
        throw new AppError("Password must be at least 6 characters and contain both letters and numbers.", 400);
    }
    if (!otp || !/^\d{6}$/.test(otp)) {
        throw new AppError("OTP must be exactly 6 digits.", 400);
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

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "7d",
    });

    res.cookie("token", token, COOKIE_OPTIONS);

    res.status(201).json({
        status: "success",
        data: { id: user.id, name: user.name, email: user.email },
    });
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        throw new AppError("Invalid email format.", 400);
    }
    if (!password) {
        throw new AppError("Password is required.", 400);
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

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "7d",
    });

    res.cookie("token", token, COOKIE_OPTIONS);

    res.json({
        status: "success",
        data: { id: user.id, name: user.name, email: user.email },
    });
};

export const logout = (_req: Request, res: Response) => {
    res.clearCookie("token", COOKIE_OPTIONS);
    res.json({ status: "success", message: "Logged out" });
};

export const getMe = async (req: Request, res: Response) => {
    const user = await db
        .selectFrom("users")
        .where("id", "=", req.userId!)
        .select(["id", "name", "email", "created_at"])
        .executeTakeFirst();

    if (!user) {
        throw new AppError("User not found.", 404);
    }

    res.json({ status: "success", data: user });
};

export const sendResetOTP = async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) throw new AppError("Email is required.", 400);

    const user = await db.selectFrom("users").where("email", "=", email).selectAll().executeTakeFirst();
    if (!user) throw new AppError("Email not found.", 404);

    const otp = generateOTP();
    await redisClient.setEx(`reset-otp:${email}`, 5 * 60, otp);
    await sendOtpEmail(email, otp);

    res.json({ status: 'success', message: 'OTP sent to email.' });
};

export const resetPassword = async (req: Request, res: Response) => {
    const { email, otp, password } = req.body;
    if (!email || !otp || !password) throw new AppError("Email, OTP and password are required.", 400);

    const storedOTP = await redisClient.get(`reset-otp:${email}`);
    if (!storedOTP || storedOTP !== otp) throw new AppError("Invalid or expired OTP.", 401);

    await redisClient.del(`reset-otp:${email}`);

    const passwordHash = await bcrypt.hash(password, 12);
    await db.updateTable("users").set({ password_hash: passwordHash }).where("email", "=", email).execute();

    res.json({ status: "success", message: "Password reset successfully." });
};

export const updateName = async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name) throw new AppError("Name is required.", 400);

    const user = await db.updateTable("users").set({ name }).where("id", "=", req.userId!).returning(["id", "name", "email"]).executeTakeFirst();
    if (!user) throw new AppError("User not found.", 404);

    res.json({ status: "success", data: user });
};

export const updatePassword = async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) throw new AppError("Old and new passwords are required.", 400);

    const user = await db.selectFrom("users").where("id", "=", req.userId!).selectAll().executeTakeFirst();
    if (!user) throw new AppError("User not found.", 404);

    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) throw new AppError("Incorrect current password.", 401);

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await db.updateTable("users").set({ password_hash: passwordHash }).where("id", "=", req.userId!).execute();

    res.json({ status: "success", message: "Password updated successfully." });
};

export const deleteAccount = async (req: Request, res: Response) => {
    const user = await db.selectFrom("users").where("id", "=", req.userId!).selectAll().executeTakeFirst();
    if (!user) throw new AppError("User not found.", 404);

    const randomUuid = crypto.randomUUID();
    const anonymizedEmail = `deleted-${randomUuid}@amozun.com`;
    const dummyPasswordHash = await bcrypt.hash(crypto.randomUUID(), 10);

    await db.transaction().execute(async (trx) => {
        await trx.updateTable("users")
            .set({
                name: "Deleted User",
                email: anonymizedEmail,
                password_hash: dummyPasswordHash
            })
            .where("id", "=", req.userId!)
            .execute();

        await trx.deleteFrom("user_addresses").where("user_id", "=", req.userId!).execute();
        await trx.deleteFrom("carts").where("user_id", "=", req.userId!).execute();
        await trx.deleteFrom("wishlists").where("user_id", "=", req.userId!).execute();
        await trx.deleteFrom("recently_viewed").where("user_id", "=", req.userId!).execute();
    });

    res.clearCookie("token", COOKIE_OPTIONS);
    res.json({ status: "success", message: "Account deleted successfully." });
};
