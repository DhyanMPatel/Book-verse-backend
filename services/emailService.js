import nodemailer from "nodemailer";
import pug from "pug";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    /**
     * Send password reset email
     * @param {string} userEmail - Recipient email address
     * @param {string} userName - User's display name
     * @param {string} resetToken - Reset token generated
     * @param {string} resetLink - Full reset password link
     * @returns {Promise<Object>} - Result of email sending
     */
    async sendResetPasswordEmail(userEmail, userName, resetToken, resetLink) {
        try {
            const templatePath = path.join(
                __dirname,
                "..",
                "templates",
                "resetPassword.pug"
            );

            // Render the pug template with data
            const html = pug.renderFile(templatePath, {
                userName,
                resetToken,
                resetLink,
                userEmail,
            });

            const mailOptions = {
                from: `"Book Verse" <${process.env.EMAIL_USER}>`,
                to: userEmail,
                subject: "🔐 Reset Your Book Verse Password",
                html,
            };

            const result = await this.transporter.sendMail(mailOptions);
            return {
                success: true,
                message: "Reset password email sent successfully",
                messageId: result.messageId,
            };
        } catch (error) {
            console.error("Error sending reset password email:", error);
            return {
                success: false,
                message: "Failed to send reset password email",
                error: error.message,
            };
        }
    }

    /**
     * Verify transporter connection
     * @returns {Promise<boolean>} - True if connection is successful
     */
    async verifyTransporter() {
        try {
            await this.transporter.verify();
            console.log("✅ Email service is ready to send emails");
            return true;
        } catch (error) {
            console.error("❌ Email service verification failed:", error);
            return false;
        }
    }
}

export default new EmailService();
