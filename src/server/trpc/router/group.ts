import { protectedProcedure, publicProcedure, router } from "../trpc";

import { slugify } from "../../../utils/slugify";
import { z } from "zod";

export const groupRouter = router({
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
  getGroupBySlug: publicProcedure.query(async () => {
    return null;
  }),
  createNewGroup: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        maxMembersAllowed: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const id = ctx.session.user.id;
      const { title } = input;

      const groupResource = await ctx.prisma.group.create({
        data: {
          title: title,
          slug: slugify(title),
          ownerId: id,
        },
      });

      const membershipResource = await ctx.prisma.membership.create({
        data: {
          userId: id,
          groupId: groupResource.id,
        },
      });

      if (!groupResource || !membershipResource) {
        throw new Error("Could not create group");
      }

      return groupResource;
    }),
});
