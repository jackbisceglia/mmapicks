import { protectedProcedure, router } from "../trpc";

export const selfRouter = router({
  getSelf: protectedProcedure.query(async ({ ctx }) => {
    const id = ctx.session?.user?.id;

    if (!id) {
      throw new Error("Not logged in");
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
