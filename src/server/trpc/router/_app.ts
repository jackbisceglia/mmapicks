import { authRouter } from "./auth";
import { eventRouter } from "./event";
import { groupRouter } from "./group";
import { router } from "../trpc";
import { selfRouter } from "./self";

export const appRouter = router({
  self: selfRouter,
  auth: authRouter,
  group: groupRouter,
  event: eventRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
