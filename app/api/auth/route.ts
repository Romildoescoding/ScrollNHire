import dbConnect from "@/app/_lib/dbConnect";
// import { verifySession } from "@/app/_lib/session";
import User from "@/app/models/UserModel";
// import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email } = await req.json();
  //   const cookieStore = cookies();
  //   const token = (await cookieStore).get("session")?.value;
  //   console.log("TH FUNCITO FOR GET DETAILS");
  //   console.log(token);
  //   console.log(email);

  //   if (!email && !token) {
  //     return NextResponse.json({ user: null });
  //   }

  try {
    if (email) {
      const user = await User.findOne({ email });

      return NextResponse.json({
        user,
      });
    }

    // else
    // Verify the token
    // const decoded = await verifySession();

    // Return user information (excluding sensitive data)
    // const mail = decoded.user?.email;
    // if (!mail) throw new Error("User email is empty");
    await dbConnect();
    const user = await User.findOne({ email });

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
        provider: user.provider,
        role: user.role,
        isOnboarded: user.isOnboarded,
        gender: user.gender,
        profession: user.profession,
        professionalTitle: user.professionalTitle,
      },
    });
  } catch (error) {
    // Token is invalid or expired
    console.log("ERROR!!!!!!!!!!!!!", error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
