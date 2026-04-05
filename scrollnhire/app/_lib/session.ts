import "server-only";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";

const key = new TextEncoder().encode(process.env.SECRET_KEY);

const cookieOptions = {
  name: "session",
  options: { httpOnly: true, secure: true, sameSite: "lax", path: "/" },
  duration: 24 * 60 * 60 * 1000,
};

export async function encrypt(payload: Record<string, any>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(key);
}

export async function decrypt(session: string | undefined) {
  try {
    if (!session) {
      // console.log("No session in decrypt");
      // console.log("SEssion is undefined or empty", session);
      return null;
    }

    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify JWT:", error);
    return null;
  }
}

//SESSION METHODS
export async function createSession(userId: object) {
  console.log("Create Session called");
  const expires = new Date(Date.now() + cookieOptions.duration);
  const session = await encrypt({ ...userId, expires });

  (await cookies()).set(cookieOptions.name, session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  });

  console.log(session);

  //   return session;
  //   redirect("/dashboard");
}

export async function verifySession(): Promise<{ user: object | undefined }> {
  // console.log("Verify session called::");
  const oAuthSession = await auth();
  const cookie = (await cookies()).get(cookieOptions.name)?.value;

  //THIS LOGIC MOVED TO THE BELW CHECK A STHIS WAS CAUSING REDIRET EVEN BEFORE CHECKING FOR OAUTH TOKEN EXISTS OR NOT
  // if () {
  //   console.warn("No session cookie found. Redirecting to login.");
  //   redirect("/auth/login");
  //   return null; // This won't execute due to redirect, for clarity
  // }

  const session = await decrypt(cookie);

  if (!cookie && !session?.userId && !oAuthSession?.user) {
    console.log(
      "Redirecting back to login due to verifySession or due to no cookie found",
    );
    redirect("/auth/login");
  }
  console.log("SESSION");
  console.log(session);
  console.log("OAUTHSESSION");
  console.log(oAuthSession);
  return { user: session?.user || oAuthSession?.user };
}

export async function updateSession() {
  const session = (await cookies()).get("session")?.value;
  if (!session) {
    console.warn("No session found to update.");
    return null;
  }

  const payload = await decrypt(session);

  if (!payload) {
    return null;
  }

  const expires = new Date(Date.now() + cookieOptions.duration);
  (await cookies()).set(cookieOptions.name, session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  });

  console.log("Session updated successfully.");
}

export async function deleteSession() {
  (await cookies()).delete(cookieOptions.name);
  await signOut({ redirect: false });
  console.log("Session deleted. Redirecting to login.");
  // redirect("/auth/login");
}
