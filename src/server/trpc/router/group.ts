import { protectedProcedure, publicProcedure, router } from "../trpc";

import { slugify } from "../../../utils/slugify";
import { z } from "zod";

// TODO:  extract member count logic to here
// const updateMemberCount = async (ctx) => {
//
// }

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
      orderBy: {
        Group: {
          createdAt: "desc",
        },
      },
    });

    // TODO: flattening array by hand for now- need to update this to be handled in the prisma query itself.
    return groups.map((group) => group.Group);
  }),
  getGroupBySlug: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      console.log(input);
      return await ctx.prisma.group.findUnique({
        where: {
          slug: input,
        },
      });
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
        groupId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const id = ctx.session.user.id;
      const { groupId } = input;

      // validate that the user has been invited to the group
      const inviteResource = await ctx.prisma.invite.findUnique({
        where: {
          userId_groupId: {
            userId: id,
            groupId: groupId,
          },
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
          userId_groupId: {
            userId: id,
            groupId: groupId,
          },
        },
      });

      if (!deleteInviteResource) {
        throw new Error("Could not delete invite");
      }

      return groupResource;
    }),
  createGroupInvite: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
        userIds: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input: { groupId, userIds } }) => {
      const isOwner = await ctx.prisma.group.findFirst({
        where: {
          id: groupId,
        },
      });

      if (!isOwner) {
        throw new Error("Not authorized to create invite");
      }
      const createInvite = async (id: string) => {
        return await ctx.prisma.invite.create({
          data: {
            userId: id,
            groupId: groupId,
          },
        });
      };
      // create many for postgres
      try {
        const inviteResources = await Promise.all(userIds.map(createInvite));
        return inviteResources;
      } catch (error) {
        return [];
      } finally {
      }
    }),
  leaveGroup: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { groupId } = input;
      const id = ctx.session.user.id;

      try {
        const deleteResource = await ctx.prisma.membership.delete({
          where: {
            userId_groupId: {
              userId: id,
              groupId: groupId,
            },
          },
        });

        if (!deleteResource) {
          return [];
        }

        // update the member count on the group
        const groupResource = await ctx.prisma.group.update({
          where: {
            id: groupId,
          },
          data: {
            numMembers: {
              decrement: 1,
            },
          },
        });

        if (!groupResource) {
          return;
        }

        return deleteResource;
      } catch (error) {
        return [];
      }
    }),
});
