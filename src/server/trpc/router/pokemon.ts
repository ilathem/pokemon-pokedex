/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { request, gql } from 'graphql-request';

import {
  type Pokemon,
  type Types,
  type GraphQLEvolutionChain,
  type GraphQLEvolutionSpecies,
  type StringArrayMap, 
  type EvolutionFinalMap,
} from '../../../utils/types'

export const pokemonRouter = router({
  getOnePokemon: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      const pokemonData:Pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${input?.name}`).then(res => res.json());
      
      // https://github.com/prisma-labs/graphql-request#usage
      const query = gql`
        query samplePokeAPIquery($name: String) {
          pokemon_v2_evolutionchain(where: {pokemon_v2_pokemonspecies: {name: {_eq: $name}}}) {
            id
            pokemon_v2_pokemonspecies(order_by: {evolves_from_species_id: asc_nulls_first}) {
              id
              name
              evolves_from_species_id
            }
          }
        }
      `

      const variables = {
        name: input?.name
      }

      const types:Array<Types> = [];
      for (let i = 0; i < pokemonData.types.length; i++) {
        const type:Types = await fetch(`https://pokeapi.co/api/v2/type/${pokemonData.types[i]?.type.name}/`)
          .then(res => res.json());
        // console.log(type.damage_relations);
        types.push(type);
      }

      const evolutionData:GraphQLEvolutionChain = await request('https://beta.pokeapi.co/graphql/v1beta', query, variables).then(data => {return data.pokemon_v2_evolutionchain[0]})
      console.log(evolutionData)
      
      const evolutionChain: StringArrayMap = {}  

      console.log(evolutionData)

      for (const link of evolutionData.pokemon_v2_pokemonspecies as GraphQLEvolutionSpecies[]) {
        if (link.evolves_from_species_id === null) {
          evolutionChain[0] = [link.name];
        } else {
          if (evolutionChain[link.evolves_from_species_id]) {
            evolutionChain[link.evolves_from_species_id] = [
              ...(evolutionChain[link.evolves_from_species_id] || []), // https://bobbyhadz.com/blog/typescript-type-undefined-must-have-symbol-iterator#:~:text=The%20%22Type%20'undefined'%20must,not%20undefined%20before%20using%20spread.
              link.name
            ]
          } else {
            evolutionChain[link.evolves_from_species_id] = [link.name]
          }
        }
      }

      console.log(evolutionChain)

      const getPhoto = async (pokemonName: string): Promise<string> => {
        const pokemonData:Pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`).then(res => res.json());
        return pokemonData.sprites.other["official-artwork"].front_default;
      }

      const evolutionFinal: EvolutionFinalMap = {}

      for (const link in evolutionChain) {
        // console.log(link)
        for (let i = 0; i < (evolutionChain[link]?.length ?? 0); i++) {
          // console.log(evolutionChain[link][i])
          
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          // if (evolutionFinal[link]) {
          //   evolutionFinal[link] = [
          //     ...evolutionFinal[link],
          //     [evolutionChain[link][i], await getPhoto(evolutionChain[link][i])]
          //   ]
          // } else {
          //   evolutionFinal[link] = [
          //     [evolutionChain[link][i],
          //     await getPhoto(evolutionChain[link][i])]
          //   ]
          // }
          evolutionFinal[link] = [
            ...(evolutionFinal[link] ?? []),
            [
              evolutionChain[link]![i]!,
              await getPhoto(evolutionChain[link]![i]!)
            ]
          ]
        }
      }

      console.log(evolutionFinal)



      return {
        pokemonData,
        types,
        evolutionFinal,
      }
    }),
  getPokeNames: publicProcedure
    .query( async () => {
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
      const data = await res.json();
      return data.results;
    }),
})