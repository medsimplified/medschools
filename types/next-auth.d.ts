// types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

// Extend the built-in Session interface
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isNewUser: boolean;
      isVerified: boolean;
      email?: string | null;
      role?: string; // <-- Add this line
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    isNewUser: boolean;
    isVerified: boolean;
    email?: string | null;
    role?: string; // <-- Add this line
  }
}

// Extend the built-in JWT interface
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isNewUser: boolean;
    isVerified: boolean;
    email?: string | null;
    role?: string; // <-- Add this line
  }
}
