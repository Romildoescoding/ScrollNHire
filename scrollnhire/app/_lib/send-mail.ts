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
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </head>

        <body
          style="
            margin: 0;
            padding: 0;
            background: #f5f7fb;
            font-family: Arial, sans-serif;
          "
        >
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="padding: 32px 16px"
          >
            <tr>
              <td align="center">

                <!-- CONTAINER -->
                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  style="
                    max-width: 600px;
                    background: #ffffff;
                    border-radius: 24px;
                    overflow: hidden;
                    box-shadow: 0 10px 35px rgba(0, 0, 0, 0.08);
                  "
                >

                  <!-- CONTENT -->
                  <tr>
                    <td
                      style="
                        padding: 48px 32px;
                        text-align: center;
                      "
                    >

                      <img
                        src="https://res.cloudinary.com/dyvlnnly8/image/upload/v1779173129/logo_black_glpdmi.png"
                        alt="ScrollnHire Logo"
                        style="
                          height:48px;
                          width:48px;
                        "
                      />

                      <h1
                        style="
                          margin-top: 14px;
                          margin-bottom: 12px;
                          color: #111827;
                          font-size: 32px;
                          line-height: 1.2;
                          font-weight: 700;
                        "
                      >
                        Verify your account
                      </h1>

                      <p
                        style="
                          margin: 0 auto;
                          max-width: 420px;
                          color: #6b7280;
                          font-size: 15px;
                          line-height: 1.7;
                        "
                      >
                        Use the verification code below to continue
                        creating your ScrollnHire account.
                      </p>

                      <!-- OTP BOX -->
                      <div
                        style="
                          margin-top: 36px;
                          background: #f3f4f6;
                          border-radius: 18px;
                          padding: 24px;
                        "
                      >
                        <p
                          style="
                            margin: 0 0 10px 0;
                            color: #6b7280;
                            font-size: 13px;
                          "
                        >
                          Your OTP Code
                        </p>

                        <div
                          style="
                            font-size: 40px;
                            font-weight: 800;
                            letter-spacing: 10px;
                            color: #111827;
                            user-select: all;
                          "
                        >
                          ${otp}
                        </div>
                      </div>

                      <p
                        style="
                          margin-top: 28px;
                          color: #9ca3af;
                          font-size: 13px;
                          line-height: 1.7;
                        "
                      >
                        This code expires in 5 minutes.
                        <br />
                        If you didn’t request this email, you can
                        safely ignore it.
                      </p>

                    </td>
                  </tr>

                  <!-- FOOTER -->
                  <tr>
                    <td
                      style="
                        padding: 0 24px 24px 24px;
                      "
                    >

                      <div
                        style="
                          width: 100%;
                          overflow: hidden;
                          text-align: center;
                          font-size: 72px;
                          line-height: 1;
                          font-weight: 700;
                          color: #111827;
                          word-break: break-word;
                        "
                      >
                        ScrollnHire
                      </div>

                      <div
                        style="
                          margin-top: 20px;
                          border-top: 1px solid #e5e7eb;
                          padding-top: 20px;
                          text-align: center;
                        "
                      >
                        <p
                          style="
                            margin: 0;
                            color: #9ca3af;
                            font-size: 12px;
                          "
                        >
                          © ${new Date().getFullYear()}
                          ScrollnHire. All rights reserved.
                        </p>
                      </div>

                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
}
