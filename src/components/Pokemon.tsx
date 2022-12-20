import {
  type FunctionComponent,
  useEffect,
  useState
} from "react";
import { trpc } from "../utils/trpc";
import { type Pokemon } from '../utils/types'
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import Image from "next/image";

interface Props {
  pokemonName: string
}

interface Map {
  [key: string]: boolean,
}

const Pokemon: FunctionComponent<Props> = ({ pokemonName }) => {
  const pokemon = trpc.pokemon.getOnePokemon.useQuery({ name: pokemonName.toLowerCase() })

  // const [ evolutions, setEvolutions ] = useState<Array<string>>([''])
  interface typeObject {
    name: string,
    double_damage_to: Array<string>,
    half_damage_from: Array<string>,
    no_damage_from: Array<string>,
    double_damage_from: Array<string>,
    half_damage_to: Array<string>,
    no_damage_to: Array<string>,
  }

  const [ typeData, setTypeData ] = useState<Array<typeObject>>([])
  const [ typeShown, setTypeShown ] = useState<Map>()

  useEffect(() => {
    
    console.log("getting types");
    if (pokemon.data === undefined) return;
    if (!pokemon.data) return;
    if (!pokemon.data.types) return;
    const typeDataArray:Array<typeObject> = []
    for (let i = 0; i < pokemon.data.types.length; i++) {
      const typeObject:typeObject = {
        name: pokemon.data.types[i]?.name || '',
        double_damage_from: [],
        double_damage_to: [],
        half_damage_from: [],
        half_damage_to: [],
        no_damage_from: [],
        no_damage_to: [],
      }
      setTypeShown({
        ...typeShown,
        [typeObject.name]: false,
      })
      if (pokemon.data.types[i]?.damage_relations.double_damage_to.length !== 0) {
        for (const types of pokemon.data.types[i]?.damage_relations.double_damage_to ?? []) {
          typeObject.double_damage_to.push(types.name);
        }
      }
      if (pokemon.data.types[i]?.damage_relations.half_damage_from.length !== 0) {
        for (const types of pokemon.data.types[i]?.damage_relations.half_damage_from ?? []) {
          typeObject.half_damage_from.push(types.name);
        }
      }
      if (pokemon.data.types[i]?.damage_relations.no_damage_from.length !== 0) {
        for (const types of pokemon.data.types[i]?.damage_relations.no_damage_from ?? []) {
          typeObject.no_damage_from.push(types.name);
        }
      }
      if (pokemon.data.types[i]?.damage_relations.double_damage_from.length !== 0) {
        for (const types of pokemon.data.types[i]?.damage_relations.double_damage_from ?? []) {
          typeObject.double_damage_from.push(types.name);
        }
      }
      if (pokemon.data.types[i]?.damage_relations.half_damage_to.length !== 0) {
        for (const types of pokemon.data.types[i]?.damage_relations.half_damage_to ?? []) {
          typeObject.half_damage_to.push(types.name);
        }
      }
      if (pokemon.data.types[i]?.damage_relations.no_damage_to.length !== 0) {
        for (const types of pokemon.data.types[i]?.damage_relations.no_damage_to ?? []) {
          typeObject.no_damage_to.push(types.name);
        }
      }
      // console.log(typeObject)
      typeDataArray.push(typeObject);
    }
    setTypeData(typeDataArray)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokemon.isFetched])

  useEffect(() =>{
    console.log(typeData)
  }, [typeData])



  // TODO: evolutions and graphql
  // TODO: stats and https://react-chartjs-2.js.org/

  // useEffect(() => {
  //   // there is no way to get evolution id's from the pokemon fetch call,
  //   // need to use graphql to query the db to get the right resources
  //   // (maybe use graphql for everything?)
  //   const getEvolutions = () => {
  //     console.log("getting evolutions...")
  //     const tempEvolutions:Array<string> = []
  //     let link:ChainLink | undefined = pokemon.data?.evolutionChain.chain.evolves_to[0];
  //     while (link) {
  //       tempEvolutions.push(link.species.name);
  //       link = link.evolves_to[0];
  //     }
  //     console.log(tempEvolutions)
  //   }
  //   getEvolutions()
  // }, [pokemon, evolutions])

  if (pokemon.isLoading) {
    return (
      <motion.div className="absolute top-0 w-full h-full flex justify-center items-center">
        <h1 className="text-4xl text-white/80">Loading...</h1>
      </motion.div>
    )
  }

  console.log(typeShown);

  //max-h-[calc(100vh-12rem)]

  if (pokemon.data) return (
    <LayoutGroup>
    <motion.div className="absolute top-32 w-full sm:h-[calc(100vh-10rem)] h-[calc(100vh-15rem)] flex flex-col justify-start items-center border-2 border-purple-600">
      <motion.div layoutScroll className="overflow-y-scroll overflow-x-hidden h-full w-full flex flex-col items-center justify-start border-0 border-pink-400 scroll-smooth">
      <Image
        key="pokeImage"
        className="h-auto w-2/3 max-w-sm"
        loader={() => pokemon.data.pokemonData.sprites.other.dream_world.front_default}
        src="/pokeball.ico"
        alt="Pokemon sprite"
        width="500"
        height="500"
      />
      <motion.ul layout key="types" className="flex flex-row items-start justify-evenly w-full text-white/80">
        
        
        {typeData.map((type) => {
          const name: string = type.name
          return (
            <motion.li layout key={name} className="z-10 border-0 border-black flex flex-col items-center text-center relative">
              <PokeType name={name} clickHandler={() => {
                if (typeShown) {
                  setTypeShown({
                    ...typeShown,
                    [name]: (!typeShown[name])
                  })
                }
                }}
                />
            <AnimatePresence mode="popLayout">
             {(typeShown && typeShown[name]) && 
             <motion.table initial={{opacity: 0}} animate={{opacity: 1}} className="z-20 text-sm border-spacing-2 border-separate border border-red-700/50">
              <tbody>
                <tr>
                  <td className="border border-red-700/50">Double Damage Dealt:</td>
                  <td className="border border-red-700/50">
                    {typeData.filter(type => type.name === name)[0]?.double_damage_to.map((typeName, index, arr) => {
                      if (index !== arr.length - 1) {
                        return typeName.charAt(0).toUpperCase() + typeName.substring(1) + ", "
                      } else {
                        return typeName.charAt(0).toUpperCase() + typeName.substring(1)
                      }
                    })}
                  </td>
                </tr>
                <tr>
                  <td className="border border-red-700/50">Half Damage Dealt:</td>
                    <td className="border border-red-700/50">
                      {typeData.filter(type => type.name === name)[0]?.half_damage_to.map((typeName, index, arr) => {
                        if (index !== arr.length - 1) {
                          return typeName.charAt(0).toUpperCase() + typeName.substring(1) + ", "
                        } else {
                          return typeName.charAt(0).toUpperCase() + typeName.substring(1)
                        }
                      })}
                  </td>
                </tr>
                <tr>
                  <td className="border border-red-700/50">No Damage Dealt:</td>
                    <td className="border border-red-700/50">
                      {typeData.filter(type => type.name === name)[0]?.no_damage_to.map((typeName, index, arr) => {
                        if (index !== arr.length - 1) {
                          return typeName.charAt(0).toUpperCase() + typeName.substring(1) + ", "
                        } else {
                          return typeName.charAt(0).toUpperCase() + typeName.substring(1)
                        }
                      })}
                  </td>
                </tr>
                <tr>
                  <td className="border border-red-700/50">Double Damage Taken:</td>
                    <td className="border border-red-700/50">
                      {typeData.filter(type => type.name === name)[0]?.double_damage_from.map((typeName, index, arr) => {
                        if (index !== arr.length - 1) {
                          return typeName.charAt(0).toUpperCase() + typeName.substring(1) + ", "
                        } else {
                          return typeName.charAt(0).toUpperCase() + typeName.substring(1)
                        }
                      })}
                  </td>
                </tr>
                <tr>
                  <td className="border border-red-700/50">Half Damage Taken:</td>
                    <td className="border border-red-700/50">
                      {typeData.filter(type => type.name === name)[0]?.half_damage_from.map((typeName, index, arr) => {
                        if (index !== arr.length - 1) {
                          return typeName.charAt(0).toUpperCase() + typeName.substring(1) + ", "
                        } else {
                          return typeName.charAt(0).toUpperCase() + typeName.substring(1)
                        }
                      })}
                  </td>
                </tr>
                <tr>
                  <td className="border border-red-700/50">No Damage Taken:</td>
                    <td className="border border-red-700/50">
                      {typeData.filter(type => type.name === name)[0]?.no_damage_from.map((typeName, index, arr) => {
                        if (index !== arr.length - 1) {
                          return typeName.charAt(0).toUpperCase() + typeName.substring(1) + ", "
                        } else {
                          return typeName.charAt(0).toUpperCase() + typeName.substring(1)
                        }
                      })}
                  </td>
                </tr>
                </tbody>
              </motion.table>}
              </AnimatePresence>
              
            </motion.li>
          )
        })}

        
      </motion.ul>
      <motion.div className="flex flex-row justify-around w-full m-1">
        <p className="text-white/50 text-lg">Weight: <span className="text-white/80">{pokemon.data.pokemonData.weight}</span><span className="text-base">kg</span></p>
        <p className="text-white/50 text-lg">Height: <span className="text-white/80">{pokemon.data.pokemonData.height}</span><span className="text-base">m</span></p>
      </motion.div>
      </motion.div>
    </motion.div>
    </LayoutGroup>
  )
  return (
    <h1>No pokemon found...?</h1>
  )
}

const PokeType = ({name, clickHandler} : {name: string, clickHandler: () => void}) => {
  return (
    <motion.p
      layout
      className={
        name === "normal" ? "bg-normal shadow-lg shadow-normal/50 rounded-xl m-1 text-center py-1 px-2 text-white/80 w-min relative" :
        name === "fire" ? "bg-fire shadow-lg shadow-fire/50 rounded-xl m-1 text-center py-1 px-2 text-white/80 w-min relative" :
        name === "water" ? "bg-water shadow-lg shadow-water/50 rounded-xl m-1 text-center py-1 px-2 text-white/80 w-min relative" :
        name === "electric" ? "bg-electric shadow-lg shadow-electric/50 rounded-xl m-1 text-center py-1 px-2 text-white/80 w-min relative" :
        name === "grass" ? "bg-grass shadow-lg shadow-grass/50 rounded-xl m-1 text-center py-1 px-2 text-white/80 w-min relative" :
        name === "ice" ? "bg-ice shadow-lg shadow-ice/50 rounded-xl m-1 text-center py-1 px-2 text-white/80 w-min relative" :
        name === "fighting" ? "bg-fighting shadow-lg shadow-fighting/50 rounded-xl m-1 text-center py-1 px-2 text-white/80 w-min relative" :
        name === "poison" ? "bg-poison shadow-lg shadow-poison/50 rounded-xl m-1 text-center py-1 px-2 text-white/80 w-min relative" :
        name === "ground" ? "bg-ground shadow-lg shadow-ground/50 rounded-xl m-1 text-center py-1 px-2 text-white/80 w-min relative" :
        name === "flying" ? "bg-flying shadow-lg shadow-flying/50 rounded-xl m-1 text-center py-1 px-2 text-white/80 w-min relative" :
        name === "psychic" ? "bg-psychic shadow-lg shadow-psychic/50 rounded-xl m-1 text-center py-1 px-2 text-white/80 w-min relative" :
        name === "bug" ? "bg-bug shadow-lg shadow-bug/50 rounded-xl m-1 text-center py-1 px-2 text-white/80 w-min relative" :
        name === "rock" ? "bg-rock shadow-lg shadow-rock/50 rounded-xl m-1 text-center py-1 px-2 text-white/80 w-min relative" :
        name === "ghost" ? "bg-ghost shadow-lg shadow-ghost/50 rounded-xl m-1 text-center py-1 px-2 text-white/80 w-min relative" :
        name === "dragon" ? "bg-dragon shadow-lg shadow-dragon/50 rounded-xl m-1 text-center py-1 px-2 text-white/80 w-min relative" :
        name === "dark" ? "bg-dark  shadow-lg shadow-dark/50 rounded-xl m-1 text-center py-1 px-2 text-white/80 w-min relative" :
        name === "steel" ? "bg-steel shadow-lg shadow-steel/50 rounded-xl m-1 text-center py-1 px-2 text-white/80 w-min relative" :
        name === "fairy" ? "bg-fairy shadow-lg shadow-fairy/50 rounded-xl m-1 text-center py-1 px-2 text-white/80 w-min relative" : ""
      }
      onClick={clickHandler}
    >
      {name}
    </motion.p>
  )
}

export default Pokemon;