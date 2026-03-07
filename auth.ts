import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/app/_lib/dbConnect";
import { User } from "@/app/models/UserModel";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  providers: [
    // -------------------------------------
    // GOOGLE SSO
    // -------------------------------------
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          scope: [
            "openid",
            "profile",
            "email",
            // "https://www.googleapis.com/auth/gmail.readonly",
          ].join(" "),
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),

    // -------------------------------------
    // EMAIL + PASSWORD LOGIN (CUSTOM)
    // -------------------------------------
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await dbConnect();
        const user = await User.findOne({ email: credentials.email });

        // ❌ User not found
        if (!user) return null;

        // ❌ Account created using Google — block credentials login
        if (user.provider !== "custom") {
          return { error: `USE_${user.provider.toUpperCase()}` };
        }

        // Password check
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isValid) return null;

        // Success
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  // -------------------------------------
  // JWT + Session callbacks
  // -------------------------------------
  callbacks: {
    async signIn({ user }) {
      // If authorize() returned an { error: ... }
      if (user && user.error) {
        return `/login?error=${user.error}`;
      }
      return true;
    },

    async jwt({ token, user, account }) {
      // When user logs in
      if (user) {
        await dbConnect();

        const dbUser = await User.findOne({ email: user.email });

        if (dbUser) {
          token.id = dbUser._id.toString(); // ✅ Mongo id
          token.role = dbUser.role;
        }
      }

      if (account?.provider === "google") {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }

      return token;
    },

    async session({ session, token }) {
      // Inject custom fields into session
      session.user.id = token.id;
      session.user.role = token.role as any;

      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;

      return session;
    },
  },
});
