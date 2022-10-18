import { PrismaClient } from "@prisma/client";
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
