import { eventRouter } from "./event";
import { groupRouter } from "./group";
import { router } from "../trpc";
import { selfRouter } from "./self";
import { userRouter } from "./user";

export const appRouter = router({
  self: selfRouter,
  user: userRouter,
  group: groupRouter,
  event: eventRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
