import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { AnimatePresence, motion } from 'framer-motion'
import { trpc } from "../utils/trpc";

interface Props {
  pokeNames: PokeNames
}

interface PokeNames {
  name: string,
  url: string,
}

const Home: NextPage<Props> = ({pokeNames}) => {

  const [ search, setSearch ] = useState('')

  const ulVariant = {
    hidden: {
      transition: {
        staggerChildren: .1,
        staggerDirection: 0,
      }
    },
    visible: {
      transition: {
        staggerChildren: .1,
      }
    }
  }

  const liVariant = {
    hidden: {
      opacity: 0,
      x: '-100%',
    },
    visible: {
      opacity: 1,
      x: 0,
    }
  }

  return (
    <>
      <Head>
        <title>Pokedex</title>
        <meta name="description" content="A simple pokedex app build" />
        <link rel="icon" href="/pokeball.ico" />
      </Head>
      <main className="flex min-h-screen flex-col justify-start items-center bg-gray-800 font-Montserrat">
        <div className="flex flex-col items-center transition relative xs:m-1">
          <input type="text" className="rounded-2xl max-w-sm w-full opacity-75 focus:opacity-90 transition outline-none p-2 mt-10 text-4xl capitalize peer duration-700" value={search} onChange={e => setSearch(e.target.value)} required/>
          <span className="absolute translate-y-12 xs:-translate-x-6 xs:text-4xl text-3xl pointer-events-none transition xs:peer-focus:translate-y-2 xs:peer-valid:-translate-x-28 peer-valid:translate-y-2 peer-valid:scale-50 peer-valid:text-white/80 peer-focus:translate-y-1 xs:peer-focus:-translate-x-28 peer-focus:scale-50 peer-focus:text-white/80 duration-300">Pokemon Name</span>
          <AnimatePresence>
            {search && 
            <motion.ul className="text-white/80 text-xl mt-2"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={ulVariant}
              layout
            >
              <motion.li 
                variants={liVariant}
              >one</motion.li>
              <motion.li 
                variants={liVariant}
              >two</motion.li>
              <motion.li 
                variants={liVariant}
              >three</motion.li>
            </motion.ul>}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
};

// export async function getStaticProps() {
//   const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
//   const data = await res.json();
//   return {
//     props: {
//       pokeNames: data.results
//     }
//   }
// }

export default Home;
