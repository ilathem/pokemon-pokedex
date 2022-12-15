import { z } from "zod";

import { router, publicProcedure } from "../trpc";

interface NameAndUrl {
  name: string,
  url: string,
}

interface Pokemon {
  id: number,
  name: string,
  base_experience: number,
  height: number,
  is_default: boolean,
  order: number,
  weight: number,
  abilities: Array<{
    ability: NameAndUrl,
    is_hidden: boolean,
    slot: number,
  }>,
  forms: Array<NameAndUrl>,
  game_indices: Array<{
    game_index: number,
    version: NameAndUrl,
  }>,
  held_items: Array<{
    item: NameAndUrl,
    version_details: Array<{
      rarity: number,
      version: NameAndUrl,
    }>
  }>,
  location_area_encounters: string,
  moves: Array<{
    move: NameAndUrl,
    version_group_details: Array<{
      level_learned_at: number,
      move_learn_method: NameAndUrl,
      version_group: NameAndUrl,
    }>
  }>,
  past_types: Array<{
    generation: NameAndUrl,
    types: Array<{
      slot: number,
      type: NameAndUrl,
    }>
  }>,
  sprites: {
    front_default: string,
    front_shiny: string,
    front_female: string,
    front_shiny_female: string,
    back_default: string,
    back_shiny: string,
    back_female: string,
    back_shiny_female: string,
    other: {
      dream_world: {
        front_default: string,
        front_female: string,
      },
      home: {
        front_default: string,
        front_female: string,
        front_shiny: string,
        front_female_shiny: string,
      },
      'official-artwork': {
        front_default: string,
      },
    }
  },
  species: NameAndUrl,
  stats: Array<{
    stat: NameAndUrl,
    effort: number,
    base_stat: number,
  }>,
  types: Array<{
    slot: number,
    type: NameAndUrl,
  }>
}

export const pokemonRouter = router({
  getOnePokemon: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${input?.name}`)
      const pokemonData:Pokemon = await res.json();
      return {
        ...pokemonData
      }
    }),
  getPokeNames: publicProcedure
    .query( async () => {
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
      const data = await res.json();
      return data.results;
    })
})