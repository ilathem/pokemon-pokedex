import { z } from "zod";
import { router, publicProcedure } from "../trpc";

import {
  type Pokemon,
  type EvolutionChain,
} from '../../../utils/types'

export const pokemonRouter = router({
  getOnePokemon: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      const pokemonData:Pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${input?.name}`).then(res => res.json());
      const id:number = pokemonData.id
      // there is no way to get evolution id's from the pokemon fetch call,
      // need to use graphql to query the db to get the right resources
      // (maybe use graphql for everything?)
      const evolutionChain:EvolutionChain = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${id}/`).then(res => res.json());
      return {
        pokemonData,
        evolutionChain,
      }
    }),
  getPokeNames: publicProcedure
    .query( async () => {
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
      const data = await res.json();
      return data.results;
    }),
})