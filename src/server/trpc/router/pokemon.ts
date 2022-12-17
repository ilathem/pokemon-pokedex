import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { request, gql } from 'graphql-request';

import {
  type Pokemon,
  type EvolutionChain,
  type EvolutionGraphQLResponse,
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
      // const evolutionChain:EvolutionChain = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${id}/`).then(res => res.json());

      const query = gql`
        query samplePokeAPIquery {
          pokemon_v2_evolutionchain(where: {pokemon_v2_pokemonspecies: {name: {_eq: "eevee"}}}) {
            id
            pokemon_v2_pokemonspecies {
              id
              name
              evolves_from_species_id
            }
          }
          pokemon_v2_pokemon(where: {name: {_eq: "eevee"}}) {
            name
            height
            weight
            base_experience
            pokemon_v2_pokemonsprites {
              sprites
            }
            pokemon_v2_pokemonstats {
              pokemon_v2_stat {
                name
              }
              base_stat
            }
            pokemon_v2_pokemontypes {
              pokemon_v2_type {
                name
              }
            }
            id
          }
          pokemon_v2_typeefficacy(distinct_on: target_type_id) {
            pokemonV2TypeByTargetTypeId {
              name
            }
            damage_factor
          }
        }
      `

      request('https://beta.pokeapi.co/graphql/v1beta', query).then(data => console.log(data))

      console.log("running backend")

      return {
        pokemonData,
        // evolutionChain,
      }
    }),
  getPokeNames: publicProcedure
    .query( async () => {
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
      const data = await res.json();
      return data.results;
    }),
})