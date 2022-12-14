import { type NextPage } from "next";
import Head from "next/head";

import { 
  useState, 
} from "react";

import SearchBar from "../components/SearchBar";
import Pokemon from "../components/Pokemon";
import { AnimatePresence } from "framer-motion";
import { type PokeName } from "../utils/types";

interface PokeNames {
  pokeNames: Array<PokeName>;
}

const Home: NextPage<PokeNames> = ({ pokeNames }) => {
  const [ selectedPokemon, setSelectedPokemon ] = useState<string>('');

  const selectPokemon = (pokemonName: string) => {
    setSelectedPokemon(pokemonName)
  }

  return (
    <>
      <Head>
        <title>Pokedex</title>
        <meta name="description" content="A simple pokedex app build" />
        <link rel="icon" href="/pokeball.ico" />
      </Head>
      <main className="flex absolute inset-0 overflow-hidden flex-col items-center justify-start bg-gray-800 font-Montserrat overscroll-none">
        <AnimatePresence>
          <SearchBar key="search" pokeNames={pokeNames} selectPokemon={selectPokemon} />
          {selectedPokemon && <Pokemon key="pokemon" pokemonName={selectedPokemon} />}
        </AnimatePresence>
      </main>
    </>
  );
};

export async function getStaticProps() {
  const res = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0"
  );
  const data = await res.json();
  const pokeNames = data.results;
  const trimmed = pokeNames.filter((element:PokeName) => !element.name.includes('-'));
  return {
    props: {
      pokeNames: trimmed,
    },
  };
}

export default Home;
