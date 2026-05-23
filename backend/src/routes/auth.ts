import { Router } from "express";
import { getMe, login, logout, sendSigupOTP, signup, sendResetOTP, resetPassword, updateName, updatePassword, deleteAccount } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";


const router = Router();

router.post('/send-signup-otp', sendSigupOTP)

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

router.get('/me', authenticate, getMe);

router.post('/send-reset-otp', sendResetOTP);
router.post('/reset-password', resetPassword);

router.put('/update-name', authenticate, updateName);
router.put('/update-password', authenticate, updatePassword);
router.delete('/account', authenticate, deleteAccount);

export default router;