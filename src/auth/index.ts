import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import authConfig from "./config";
import { getUserById } from "@/actions/user";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  callbacks: {
    jwt: async ({ token }) => {
      if (!token.sub) {
        return token;
      }

      const db_user = await getUserById(token.sub);

      if (!db_user) {
        return token;
      }

      token.id = db_user.id;
      token.credits = db_user.credits;
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
        session.user.credits = token.credits as number;
      }
      return session;
    },
  },
  ...authConfig,
});
