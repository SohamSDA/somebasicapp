import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import { AdapterUser } from "next-auth/adapters";

interface CustomCredentials {
  identifier?: string;
  password?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: CustomCredentials | undefined
      ): Promise<AdapterUser | null> {
        await dbConnect();

        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const identifier = credentials.identifier.trim();
        const password = credentials.password;

        const user = await UserModel.findOne({
          $or: [{ email: identifier }, { username: identifier }],
        }) as (typeof UserModel)["prototype"] | null;

        if (!user) {
          throw new Error("No user found with this email or username");
        }

        if (!user.isVerified) {
          throw new Error("Please verify your account before logging in");
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
          throw new Error("Incorrect password");
        }

        // ✅ Return a plain object with all required AdapterUser properties
        return {
          id: user._id.toString(),      // required by NextAuth
          _id: user._id.toString(),     // custom property
          name: user.username,          // optional
          username: user.username,      // custom property
          email: user.email,            // optional
          emailVerified: user.emailVerified ?? null, // AdapterUser property
          isVerified: user.isVerified ?? false,      // custom property
          isAcceptingMessages: user.isAcceptingMessages ?? false, // custom property
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user.id; // from authorize() result
        token.username = user.name ?? "";
        token.email = user.email;

        const dbUser = await UserModel.findById(user.id).lean();
        token.isVerified = dbUser?.isVerified ?? false;
        token.isAcceptingMessages = dbUser?.isAcceptingMessages ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user._id = token._id;
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXT_AUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
};
