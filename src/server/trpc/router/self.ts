import { protectedProcedure, publicProcedure, router } from "../trpc";

import { z } from "zod";

export const selfRouter = router({
  getAllSelfGroups: protectedProcedure.query(async ({ ctx }) => {
    const id = ctx.session?.user?.id;

    if (!id) {
      throw new Error("Not logged in");
    }

    const groups = await ctx.prisma.membership.findMany({
      where: {
        userId: id,
      },
      select: {
        Group: {},
      },
    });

    // TODO: flattening array by hand for now- need to update this to be handled in the prisma query itself.
    return groups.map((group) => group.Group);
  }),
  hello: publicProcedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
});

// export const mainRouter = router({
//   hello: publicProcedure
//     .input(z.object({ text: z.string().nullish() }).nullish())
//     .query(({ input }) => {
//       return {
//         greeting: `Hello ${input?.text ?? "world"}`,
//       };
//     }),
//   getAll: publicProcedure.query(({ ctx }) => {
//     return ctx.prisma.example.findMany();
//   }),
// });
