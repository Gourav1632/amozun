import { Resend } from "resend";
import { logger } from "../utils/logger.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOrderConfirmationEmail = async (
    email: string,
    name: string,
    orderId: string,
    totalAmount: number
) => {
    if (!process.env.RESEND_API_KEY) {
        logger.warn('RESEND_API_KEY not found. Skipping email sending.');
        return;
    }

    try {
        await resend.emails.send({
            from: "Amozun <onboarding@resend.dev>", // using Resend's test domain
            to: email,
            subject: `Order Confirmation - #${orderId.substring(0, 8)}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Hello ${name},</h2>
                <p>Thank you for shopping at Amozun! Your order has been confirmed.</p>
                <p><strong>Order ID:</strong> ${orderId}</p>
                <p><strong>Total Amount:</strong> ₹${Number(totalAmount).toFixed(2)}</p>
                <p>We'll notify you once it ships.</p>
                </div>
            `,
        });

        logger.info(`Confirmation email sent to ${email}`);
    } catch (err) {
        // Don't use AppError here - email failure should not fail the order
        logger.error('Failed to send email: ', err);
    }
};



export const sendOtpEmail = async (email: string, otp: string) => {
    if (!process.env.RESEND_API_KEY) {
        logger.warn("RESEND_API_KEY not found. Skipping OTP email.");
        logger.info(`[DEVELOPMENT ONLY] OTP for ${email} is: ${otp}`);
        return;
    }

    try {
        await resend.emails.send({
            from: "Amozun Security <onboarding@resend.dev>",
            to: email,
            subject: `Your Amozun Verification Code: ${otp}`,
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Security Verification</h2>
          <p>Your one-time password (OTP) is:</p>
          <h1 style="font-size: 32px; letter-spacing: 4px; color: #FF9900;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
        });
        logger.info(`OTP email sent to ${email}`);
    } catch (error) {
        logger.error("Failed to send OTP email:", error);
        throw new Error("Failed to send verification email. Please try again.");
    }
};



