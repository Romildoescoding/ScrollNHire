import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import dbConnect from "@/app/_lib/dbConnect";

import { OTP } from "@/app/models/OtpModel";
import { User } from "@/app/models/UserModel";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { email, password, otp } = await req.json();

    const otpDoc = await OTP.findOne({
      email,
    });

    if (!otpDoc) {
      return NextResponse.json(
        {
          message: "OTP expired",
        },
        {
          status: 400,
        },
      );
    }

    const isOtpCorrect = await bcrypt.compare(otp, otpDoc.otp);

    if (!isOtpCorrect) {
      return NextResponse.json(
        {
          message: "Invalid OTP",
        },
        {
          status: 400,
        },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashedPassword,

      provider: "custom",
      providerId: email,
    });

    await OTP.deleteMany({ email });

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      {
        message: "OTP verification failed",
      },
      {
        status: 500,
      },
    );
  }
}
