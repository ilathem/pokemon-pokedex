import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { trpc } from "../utils/trpc";
import { scheduleMicrotask } from "@tanstack/query-core/build/lib/utils";

interface Props {
  pokeNames: Array<PokeNames>;
}

interface PokeNames {
  name: string;
  url: string;
}

const Home: NextPage<Props> = ({ pokeNames }) => {
  const [searchString, setSearchString] = useState<string>("");
  const [autoFill, setAutoFill] = useState<Array<string>>([]);

  useEffect(() => {
    console.log(pokeNames);
  }, [pokeNames]);

  console.log(autoFill);

  const ulVariant = {
    hidden: {
      // transition: {
      //   staggerChildren: .05,
      //   staggerDirection: 0,
      // }
    },
    visible: {
      // transition: {
      //   staggerChildren: .05,
      // }
    },
  };

  const autoComplete = (searchTerm: string) => {
    const tempArray: Array<string> = [];
    for (const poke of pokeNames) {
      if (
        poke.name.substring(0, searchTerm.length).toUpperCase() ===
        searchTerm.toUpperCase()
      ) {
        console.log(poke.name);
        tempArray.push(
          `${poke.name.charAt(0).toUpperCase()}${poke.name.slice(1)}`
        );
      }
    }
    setAutoFill(tempArray);
  };

  const selectPokemon = (pokemonName: string) => {
    setSearchString(pokemonName)
    setAutoFill([])
  }

  return (
    <>
      <Head>
        <title>Pokedex</title>
        <meta name="description" content="A simple pokedex app build" />
        <link rel="icon" href="/pokeball.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-start bg-gray-800 font-Montserrat overflow-hidden">
        <div className="relative flex flex-col items-center transition xs:m-1">
          <input
            spellCheck={false}
            type="text"
            className="peer mt-10 w-full max-w-sm rounded-2xl p-2 text-4xl capitalize opacity-75 outline-none transition duration-700 focus:opacity-90"
            value={searchString}
            onChange={(e) => {
              setSearchString(e.target.value);
              autoComplete(e.target.value);
            }}
            required
          />
          <span className="pointer-events-none absolute translate-y-12 text-3xl transition duration-300 peer-valid:translate-y-2 peer-valid:scale-50 peer-valid:text-white/80 peer-focus:translate-y-1 peer-focus:scale-50 peer-focus:text-white/80 xs:-translate-x-6 xs:text-4xl xs:peer-valid:-translate-x-28 xs:peer-focus:translate-y-2 xs:peer-focus:-translate-x-28">
            Pokemon Name
          </span>
          <AnimatePresence>
            {searchString && (
              <motion.ul
                className="
                mt-2 
                flex 
                h-[calc(100vh-8rem)]
                w-full 
                flex-col 
                overflow-y-auto 
                overflow-x-hidden
                border-0 
                border-red-600 
                text-xl
                text-white/80
              "
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={ulVariant}
                layout
              >
                <AnimatePresence>
                  {autoFill.map((pokeName) => (
                    <PokemonName key={pokeName} pokemonName={pokeName} selectPokemon={selectPokemon}/>
                  ))}
                </AnimatePresence>
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
};

const PokemonName = (
  { pokemonName, selectPokemon }: 
  { pokemonName: string, selectPokemon: (pokemonName: string) => void }
) => {
  const liVariant = {
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.1,
      },
    },
    visible: {
      opacity: 1,
    },
  };
  
  return (
    <motion.li
      variants={liVariant}
      layout
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="cursor-pointer p-[.1rem] transition-colors hover:text-red-600"
      onClick={() => selectPokemon(pokemonName)}
    >
      {pokemonName}
    </motion.li>
  );
};

export async function getStaticProps() {
  const res = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0"
  );
  const data = await res.json();
  return {
    props: {
      pokeNames: data.results,
    },
  };
}

export default Home;
