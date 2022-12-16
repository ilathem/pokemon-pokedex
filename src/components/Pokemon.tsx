import {
  type FunctionComponent,
  useEffect,
  useState
} from "react";
import { trpc } from "../utils/trpc";
import { type Pokemon, type ChainLink } from '../utils/types'
import { motion } from "framer-motion";
import Image from "next/image";

interface Props {
  pokemonName: string
}

const Pokemon: FunctionComponent<Props> = ({ pokemonName }) => {
  const pokemon = trpc.pokemon.getOnePokemon.useQuery({ name: pokemonName.toLowerCase() })
  const [ evolutions, setEvolutions ] = useState<Array<string>>([''])

  // TODO: evolutions and graphql
  // TODO: stats and https://react-chartjs-2.js.org/

  useEffect(() => {
    // there is no way to get evolution id's from the pokemon fetch call,
    // need to use graphql to query the db to get the right resources
    // (maybe use graphql for everything?)
    const getEvolutions = () => {
      console.log("getting evolutions...")
      const tempEvolutions:Array<string> = []
      let link:ChainLink | undefined = pokemon.data?.evolutionChain.chain.evolves_to[0];
      while (link) {
        tempEvolutions.push(link.species.name);
        link = link.evolves_to[0];
      }
      console.log(tempEvolutions)
    }
    getEvolutions()
  }, [pokemon, evolutions])

  if (pokemon.isLoading) {
    return (
      <motion.div className="absolute top-0 w-full h-full flex justify-center items-center">
        <h1 className="text-4xl text-white/80">Loading...</h1>
      </motion.div>
    )
  }

  if (pokemon.data) return (
    <motion.div className="absolute top-32 w-2/3 max-w-sm h-1/2 flex flex-col justify-start items-center px-2">
      <Image
        key="pokeImage"
        className="h-auto w-full"
        loader={() => pokemon.data.pokemonData.sprites.other.dream_world.front_default}
        src="/pokeball.ico"
        alt="Pokemon sprite"
        width="500"
        height="500"
      />
      <ul key="types" className="flex flex-row items-center">
        {pokemon.data.pokemonData.types.map(type => {
          const name: string = type.type.name
          return (
            <li 
              key={name}
              className={
                name === "normal" ? "bg-normal shadow-lg shadow-normal/50 rounded-xl m-1 text-center py-1 px-2 text-white/80" :
                name === "fire" ? "bg-fire shadow-lg shadow-fire/50 rounded-xl m-1 text-center py-1 px-2 text-white/80" :
                name === "water" ? "bg-water shadow-lg shadow-water/50 rounded-xl m-1 text-center py-1 px-2 text-white/80" :
                name === "electric" ? "bg-electric shadow-lg shadow-electric/50 rounded-xl m-1 text-center py-1 px-2 text-white/80" :
                name === "grass" ? "bg-grass shadow-lg shadow-grass/50 rounded-xl m-1 text-center py-1 px-2 text-white/80" :
                name === "ice" ? "bg-ice shadow-lg shadow-ice/50 rounded-xl m-1 text-center py-1 px-2 text-white/80" :
                name === "fighting" ? "bg-fighting shadow-lg shadow-fighting/50 rounded-xl m-1 text-center py-1 px-2 text-white/80" :
                name === "poison" ? "bg-poison shadow-lg shadow-poison/50 rounded-xl m-1 text-center py-1 px-2 text-white/80" :
                name === "ground" ? "bg-ground shadow-lg shadow-ground/50 rounded-xl m-1 text-center py-1 px-2 text-white/80" :
                name === "flying" ? "bg-flying shadow-lg shadow-flying/50 rounded-xl m-1 text-center py-1 px-2 text-white/80" :
                name === "psychic" ? "bg-psychic shadow-lg shadow-psychic/50 rounded-xl m-1 text-center py-1 px-2 text-white/80" :
                name === "bug" ? "bg-bug shadow-lg shadow-bug/50 rounded-xl m-1 text-center py-1 px-2 text-white/80" :
                name === "rock" ? "bg-rock shadow-lg shadow-rock/50 rounded-xl m-1 text-center py-1 px-2 text-white/80" :
                name === "ghost" ? "bg-ghost shadow-lg shadow-ghost/50 rounded-xl m-1 text-center py-1 px-2 text-white/80" :
                name === "dragon" ? "bg-dragon shadow-lg shadow-dragon/50 rounded-xl m-1 text-center py-1 px-2 text-white/80" :
                name === "dark" ? "bg-dark  shadow-lg shadow-dark/50 rounded-xl m-1 text-center py-1 px-2 text-white/80" :
                name === "steel" ? "bg-steel shadow-lg shadow-steel/50 rounded-xl m-1 text-center py-1 px-2 text-white/80" :
                name === "fairy" ? "bg-fairy shadow-lg shadow-fairy/50 rounded-xl m-1 text-center py-1 px-2 text-white/80" : ""
              }
            >
              {name}
            </li>
          )
        })}
      </ul>
      <motion.div className="flex flex-row justify-around w-full m-1">
        <p className="text-white/50 text-lg">Weight: <span className="text-white/80">{pokemon.data.pokemonData.weight}</span><span className="text-base">kg</span></p>
        <p className="text-white/50 text-lg">Height: <span className="text-white/80">{pokemon.data.pokemonData.height}</span><span className="text-base">m</span></p>
      </motion.div>
      {/* <p className="text-2xl text-white/80">Base Stats</p> */}

      {/* <ul key="evolution">
        {pokemon.data.evolutionChain.chain.species.name}
      </ul> */}
    </motion.div>
  )
  return (
    <h1>No pokemon found...?</h1>
  )
}

export default Pokemon;