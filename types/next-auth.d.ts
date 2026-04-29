import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      uid: string;
      plan: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid: string;
    plan: string;
  }
}
