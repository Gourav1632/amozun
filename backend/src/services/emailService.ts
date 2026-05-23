import { Resend } from "resend";
import { logger } from "../utils/logger.js";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailItem {
    name: string;
    price: number | string;
    quantity: number;
    image_url: string | null;
}

export const sendOrderConfirmationEmail = async (
    email: string,
    name: string,
    orderId: string,
    totalAmount: number,
    items: EmailItem[]
) => {
    if (!process.env.RESEND_API_KEY) {
        logger.warn('RESEND_API_KEY not found. Skipping email sending.');
        return;
    }

    try {

        let itemsHtml = '';
        for (const item of items) {
            const defaultImage = "https://via.placeholder.com/60?text=No+Image";
            itemsHtml += `
                <tr>
                    <td style="padding: 15px 0; border-bottom: 1px solid #eaeaea; width: 80px;">
                        <img src="${item.image_url || defaultImage}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: contain; border: 1px solid #eaeaea; border-radius: 4px;" />
                    </td>
                    <td style="padding: 15px 10px; border-bottom: 1px solid #eaeaea; color: #0f1111;">
                        <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">${item.name}</div>
                        <div style="color: #565959; font-size: 13px;">Qty: ${item.quantity}</div>
                    </td>
                    <td style="padding: 15px 0; border-bottom: 1px solid #eaeaea; text-align: right; font-weight: bold; color: #b12704; font-size: 14px;">
                        ₹${(Number(item.price) * item.quantity).toFixed(2)}
                    </td>
                </tr>
            `;
        }

        const htmlContent = `
            <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #dddddd; border-radius: 8px; overflow: hidden;">
                <!-- Header -->
                <div style="background-color: #232f3e; padding: 20px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: -1px;">
                        Amozun<span style="color: #ff9900;">.in</span>
                    </h1>
                </div>
                
                <!-- Body -->
                <div style="padding: 30px 20px;">
                    <h2 style="color: #0f1111; margin-top: 0;">Order Confirmation</h2>
                    <p style="color: #0f1111; font-size: 15px; line-height: 1.5;">Hello <strong>${name}</strong>,</p>
                    <p style="color: #0f1111; font-size: 15px; line-height: 1.5;">Thank you for shopping with us. We'll send a confirmation when your item ships. Your order details are indicated below.</p>
                    
                    <!-- Order Summary Box -->
                    <div style="background-color: #f6f6f6; border: 1px solid #eaeaea; border-radius: 4px; padding: 15px; margin: 25px 0;">
                        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                            <tr>
                                <td style="color: #565959; padding-bottom: 5px;">Order ID:</td>
                                <td style="color: #0f1111; font-weight: bold; text-align: right; padding-bottom: 5px;">#${orderId.substring(0, 8).toUpperCase()}</td>
                            </tr>
                            <tr>
                                <td style="color: #565959; padding-top: 5px; border-top: 1px solid #eaeaea;"><strong>Order Total:</strong></td>
                                <td style="color: #b12704; font-weight: bold; font-size: 18px; text-align: right; padding-top: 5px; border-top: 1px solid #eaeaea;">₹${Number(totalAmount).toFixed(2)}</td>
                            </tr>
                        </table>
                    </div>

                    <!-- Items List -->
                    <h3 style="color: #0f1111; margin-bottom: 10px; font-size: 16px;">Order Details</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        ${itemsHtml}
                    </table>
                    
                    <p style="color: #565959; font-size: 13px; margin-top: 30px; text-align: center;">
                        We hope to see you again soon.<br/>
                        <strong>Amozun.in</strong>
                    </p>
                </div>
            </div>
        `;

        await resend.emails.send({
            from: "Amozun <onboarding@resend.dev>", // using Resend's test domain
            to: email,
            subject: `Your Amozun.in order #${orderId.substring(0, 8).toUpperCase()}`,
            html: htmlContent,
        });

        logger.info(`Confirmation email with receipt sent to ${email}`);
    } catch (err) {
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



