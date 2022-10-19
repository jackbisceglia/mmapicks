import { protectedProcedure, router } from "../trpc";

export const selfRouter = router({
  getSelf: protectedProcedure.query(async ({ ctx }) => {
    const id = ctx.session?.user?.id;

    if (!id) {
      throw new Error("No Identifier");
    }

    const user = await ctx.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }),
  getInvites: protectedProcedure.query(async ({ ctx }) => {
    const id = ctx.session?.user?.id;

    if (!id) {
      throw new Error("No Identifier");
    }

    const invites = await ctx.prisma.invite.findMany({
      where: {
        userId: id,
      },
      include: {
        Group: {},
      },
    });
    return invites;
  }),
});
