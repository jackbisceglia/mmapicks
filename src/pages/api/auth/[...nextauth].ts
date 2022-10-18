import NextAuth, { type NextAuthOptions } from "next-auth";
import GitHub from "next-auth/providers/github";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { env } from "../../../env/server.mjs";
import generateUsername from "../../../utils/generateUsername";

export const authOptions: NextAuthOptions = {
  events: {
    createUser: async (message) => {
      const { user } = message;

      if (!user) {
        return;
      }

      const generatedUsername = await generateUsername(user.name ?? "");

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { username: generatedUsername },
      });
    },
  },
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
};

export default NextAuth(authOptions);
