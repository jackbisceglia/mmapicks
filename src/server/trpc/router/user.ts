import { protectedProcedure, router } from "../trpc";

import { z } from "zod";

export const userRouter = router({
  getRelevantUsers: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const relevantUsers = await ctx.prisma.user.findMany({
        where: {
          username: {
            contains: input,
          },
        },
      });
      return relevantUsers;
    }),
});
