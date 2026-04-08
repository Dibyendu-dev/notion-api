import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendMagicLinkEmail = async (email, signInUrl, firstName) => {
  try {
    const info = await transporter.sendMail({
      from: `"Notion API" <${process.env.SMTP_USER || "noreply@example.com"}>`,
      to: email,
      subject: "Your Magic Sign-In Link",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome${firstName ? `, ${firstName}` : ""}!</h2>
          <p>Click the button below to sign in to your account:</p>
          <a href="${signInUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">Sign In</a>
          <p>Or copy and paste this link:</p>
          <p><a href="${signInUrl}">${signInUrl}</a></p>
          <p>This link will expire in 10 minutes.</p>
          <p>If you didn't request this email, you can safely ignore it.</p>
        </div>
      `,
    });
    console.log("Magic link email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
};
