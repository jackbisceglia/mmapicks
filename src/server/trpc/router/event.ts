import { protectedProcedure, publicProcedure, router } from "../trpc";

import { z } from "zod";

export const eventRouter = router({
  getUpcomingEvents: protectedProcedure.query(async ({ ctx }) => {
    const today = new Date();
    return await ctx.prisma.event.findMany({
      where: {
        date: {
          gte: today,
        },
      },
    });
  }),
  getPastEvents: protectedProcedure.query(async ({ ctx }) => {
    const today = new Date();
    return await ctx.prisma.event.findMany({
      where: {
        date: {
          lte: today,
        },
      },
    });
  }),
});
