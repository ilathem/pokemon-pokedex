import { router } from "../trpc";
import { exampleRouter } from "./example";
import { pokemonRouter } from "./pokemon";

export const appRouter = router({
  example: exampleRouter,
  pokemon: pokemonRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
