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
        Group: true,
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
          numMembers: 1,
          Owner: {
            connect: {
              id: id,
            },
          },
          Membership: {
            create: {
              userId: id,
            },
          },
        },
      });

      if (!groupResource) {
        throw new Error("Could not create group");
      }

      return groupResource;
    }),
  acceptUserInvite: protectedProcedure
    .input(
      z.object({
        inviteId: z.string(),
        groupId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const id = ctx.session.user.id;
      const { inviteId, groupId } = input;

      // validate that the user has been invited to the group
      const inviteResource = await ctx.prisma.invite.findMany({
        where: {
          AND: [
            {
              id: inviteId,
            },
            {
              userId: id,
            },
          ],
        },
      });

      if (!inviteResource) {
        throw new Error("Invite not found");
      }

      // create a membership
      const membershipResource = await ctx.prisma.membership.create({
        data: {
          userId: id,
          groupId: groupId,
        },
      });

      if (!membershipResource) {
        throw new Error("Could not add user to group");
      }

      // update the member count on the group

      const groupResource = await ctx.prisma.group.update({
        where: {
          id: groupId,
        },
        data: {
          numMembers: {
            increment: 1,
          },
        },
      });

      if (!groupResource) {
        throw new Error("Could not update group");
      }

      // delete invitation
      const deleteInviteResource = await ctx.prisma.invite.delete({
        where: {
          id: inviteId,
        },
      });

      if (!deleteInviteResource) {
        throw new Error("Could not delete invite");
      }

      return groupResource;
    }),
});
