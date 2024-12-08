import Google from "next-auth/providers/google";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import { User } from "@prisma/client";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    credits: number;
  }
}

export default {
  providers: [Google],
} satisfies NextAuthConfig;
