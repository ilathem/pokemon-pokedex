import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { request, gql } from 'graphql-request';

import {
  type Pokemon,
  type GraphQLResponse,
  type Types,
} from '../../../utils/types'

export const pokemonRouter = router({
  getOnePokemon: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      const pokemonData:Pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${input?.name}`).then(res => res.json());
      
      const query = gql`
        query samplePokeAPIquery {
          pokemon_v2_evolutionchain(where: {pokemon_v2_pokemonspecies: {name: {_eq: "eevee"}}}) {
            id
            pokemon_v2_pokemonspecies(order_by: {evolves_from_species_id: asc_nulls_first}) {
              id
              name
              evolves_from_species_id
            }
          }
        }
      `

      const types:Array<Types> = [];
      for (let i = 0; i < pokemonData.types.length; i++) {
        const type:Types = await fetch(`https://pokeapi.co/api/v2/type/${pokemonData.types[i]?.type.name}/`)
          .then(res => res.json());
        // console.log(type.damage_relations);
        types.push(type);
      }

      // console.log(types);
      


      // const evolutionData:GraphQLResponse = await request('https://beta.pokeapi.co/graphql/v1beta', query).then(data => {return data.pokemon_v2_evolutionchain[0]})
      

      


      return {
        pokemonData,
        types,
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