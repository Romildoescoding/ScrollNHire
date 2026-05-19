import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import dbConnect from "@/app/_lib/dbConnect";

import { OTP } from "@/app/models/OtpModel";
import { sendOtpEmail } from "@/app/_lib/send-mail";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { email } = await req.json();

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp = await bcrypt.hash(otp, 10);

    await OTP.deleteMany({ email });

    await OTP.create({
      email,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendOtpEmail(email, otp);

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      {
        message: "Failed to resend OTP",
      },
      {
        status: 500,
      },
    );
  }
}
