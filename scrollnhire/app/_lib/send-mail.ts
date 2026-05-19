import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendOtpEmail(email: string, otp: string) {
  await transporter.sendMail({
    from: `"ScrollnHire" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your ScrollnHire account",

    html: `
      <div style="font-family:sans-serif;padding:20px">
        <h2>ScrollnHire Verification</h2>

        <p>Your verification code is:</p>

        <h1 style="
          letter-spacing:8px;
          font-size:40px;
        ">
          ${otp}
        </h1>

        <p>This code expires in 5 minutes.</p>
      </div>
    `,
  });
}
