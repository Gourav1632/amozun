import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOrderConfirmationEmail = async (
    email: string,
    name: string,
    orderId: string,
    totalAmount: number
) => {
    if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY not found. Skipping email sending.');
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

        console.log(`Confirmation email sent to ${email}`);
    } catch (err) {
        // Don't use AppError here - email failure should not fail the order
        console.error('Failed to send email: ', err);
    }
};



