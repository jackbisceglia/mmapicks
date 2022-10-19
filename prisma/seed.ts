import { PrismaClient, User } from "@prisma/client";

import events from "../src/utils/content/events";

const prisma = new PrismaClient();
async function main() {
  for (const event of events) {
    await prisma.event.create({
      data: {
        title: event?.title ?? "",
        mainEvent: event?.mainEvent ?? "",
        date: event?.date ?? new Date(),
        promotion: event?.promotion ?? "",
        venue: event?.venue ?? "",
        location: event?.location ?? "",
        fights: {
          create: [
            ...event.fights.map((fight) => ({
              fighters: {
                create: [
                  ...fight.fighters.map((fighter) => ({
                    ...fighter,
                  })),
                ],
              },
            })),
          ],
        },
      },
    });
  }
  const users = [
    {
      email: "gary@gmail.com",
      name: "Gary",
      image: `https://avatars.dicebear.com/api/bottts/gary.png`,
      username: "gary",
    },
    {
      email: "john@gmail.com",
      name: "John",
      image: `https://avatars.dicebear.com/api/bottts/john.png`,
      username: "john",
    },
  ];

  const createdUsers = await Promise.all(
    users.map(async (user) => await prisma.user.create({ data: user }))
  );

  if (!createdUsers || createdUsers.length === 0) {
    throw new Error("Could not create users");
  }

  const groups = [
    {
      title: "The Best Group",
      slug: "the-best-group",
      numMembers: 2,
      Owner: {
        connect: {
          id: createdUsers[0]?.id,
        },
      },
      Membership: {
        create: [
          {
            User: {
              connect: {
                id: createdUsers[0]?.id,
              },
            },
          },
          {
            User: {
              connect: {
                id: createdUsers[1]?.id,
              },
            },
          },
        ],
      },
    },
    {
      title: "John's Group",
      slug: "johns-group",
      numMembers: 1,
      Owner: {
        connect: {
          id: createdUsers[0]?.id,
        },
      },
      Membership: {
        create: [
          {
            User: {
              connect: {
                id: createdUsers[1]?.id,
              },
            },
          },
        ],
      },
    },
  ];

  const createdGroups = await Promise.all(
    groups.map(async (group) => await prisma.group.create({ data: group }))
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
