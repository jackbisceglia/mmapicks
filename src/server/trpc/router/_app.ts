import { authRouter } from "./auth";
// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { selfRouter } from "./self";

export const appRouter = router({
  self: selfRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
