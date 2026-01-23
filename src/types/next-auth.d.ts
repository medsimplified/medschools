import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      role?: string;
      isNewUser?: boolean;
      isVerified?: boolean;
    };
  }
  interface User extends DefaultUser {
    role?: string;
    isNewUser?: boolean;
    isVerified?: boolean;
  }
}
