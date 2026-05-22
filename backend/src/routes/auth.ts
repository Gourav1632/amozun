import { Router } from "express";
import { getMe, login, logout, sendSigupOTP, signup } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";


const router = Router();

router.post('/send-signup-otp', sendSigupOTP)

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

router.get('/me', authenticate, getMe);

export default router;