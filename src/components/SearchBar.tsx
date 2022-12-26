import { 
  type FunctionComponent,
  useState, 
} from "react";

import { 
  AnimatePresence, 
  LayoutGroup, 
  motion, 
} from "framer-motion";

import { 
  ulVariant,
  liVariant,
} from "../styles/framer-variants";

interface Props {
  pokeNames: Array<PokeNames>
  selectPokemon:  (pokemonName: string) => void 
}

interface PokeNames {
  name: string;
  url: string;
}

const SearchBar: FunctionComponent<Props> = (
  { pokeNames, selectPokemon }
) => {
  // console.log(pokeNames)
  const [searchString, setSearchString] = useState<string>("");
  const [autoFill, setAutoFill] = useState<Array<string>>([]);

  const autoComplete = (searchTerm: string) => {
    const tempArray: Array<string> = [];
    for (const poke of pokeNames) {
      if (
        poke.name.substring(0, searchTerm.length).toUpperCase() ===
        searchTerm.toUpperCase()
      ) {
        // console.log(poke.name);
        tempArray.push(
          `${poke.name.charAt(0).toUpperCase()}${poke.name.slice(1)}`
        );
      }
    }
    if (tempArray.length) {
      setAutoFill(tempArray);
    } else {
      setAutoFill(["No pokemon found"])
    }
  };

  const runSelectPokemon = (pokemonName: string) => {
    selectPokemon(pokemonName)
    setSearchString(pokemonName)
    setAutoFill([])
  }

  return (
    <div className="absolute flex flex-col items-center transition xs:m-1 z-10">
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
      <LayoutGroup>
      <AnimatePresence>
          {(searchString && autoFill.length > 0) && (
            <motion.ul
              className="mt-2 flex max-h-[calc(100vh-8rem)] h-min w-full flex-col overflow-y-auto overflow-x-hidden border-0 border-red-600 text-xl text-white/80 scrollbar-thin scrollbar-thumb-white/50 scrollbar-thumb-rounded-full bg-zinc-800/80 rounded-xl p-2"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={ulVariant}
              layout
            >
              <AnimatePresence>
                {autoFill.map((pokeName) => (
                  <PokemonName key={pokeName} pokemonName={pokeName} selectPokemon={runSelectPokemon}/>
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
      </AnimatePresence>
      </LayoutGroup>
    </div>
  )
}

const PokemonName = (
  { pokemonName, selectPokemon }: 
  { pokemonName: string, selectPokemon: (pokemonName: string) => void }
) => {
  return (
    <motion.li
      variants={liVariant}
      layout
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="cursor-pointer p-[.1rem] transition-colors hover:text-red-600"
      onClick={() => {
        selectPokemon(pokemonName)
      }}
    >
      {pokemonName}
    </motion.li>
  );
};

export default SearchBar;