export interface PokeName {
  name: string;
  url: string;
}

export interface NameAndUrl {
  name: string,
  url: string,
}

export interface Pokemon {
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

export interface EvolutionDetail {
  item: NameAndUrl,
  trigger: NameAndUrl,
  gender: number,
  held_item: NameAndUrl,
  known_move: NameAndUrl,
  known_move_type: NameAndUrl,
  location: NameAndUrl,
  min_level: number,
  min_happiness: number,
  min_beauty: number,
  min_affection: number,
  needs_overworld_rain: number,
  party_species: NameAndUrl,
  party_type: NameAndUrl,
  relative_physical_stats: NameAndUrl,
  time_of_day: string,
  trade_species: NameAndUrl,
  turn_upside_down: boolean
}

export interface ChainLink {
  is_baby: boolean,
  species: NameAndUrl,
  evolution_details: Array<EvolutionDetail>,
  evolves_to: Array<ChainLink>,
}

export interface EvolutionChain {
  id: number,
  baby_trigger_item: NameAndUrl,
  chain: ChainLink
}

export interface GraphQLEvolutionChain {
  id: number,
  pokemon_v2_pokemonspecies: Array<GraphQLEvolutionSpecies>,
}

export interface GraphQLEvolutionSpecies {
  id: number,
  name: string,
  evolves_from_species_id: number | null,
} 

// export interface GraphQLResponse {
//   pokemon_v2_evolutionchain: GraphQLEvolutionChain
// }

// export interface EvolutionStep {
//   name: string,
  
// }

// export interface Evolutions {

// }

export interface TypeRelations {
  no_damage_to: Array<NameAndUrl>,
  half_damage_to: Array<NameAndUrl>,
  double_damage_to: Array<NameAndUrl>,
  no_damage_from: Array<NameAndUrl>,
  half_damage_from: Array<NameAndUrl>,
  double_damage_from: Array<NameAndUrl>,
}

export interface TypeRelationsPast {
  generation: NameAndUrl,
  damage_relations: TypeRelations
}

export interface GenerationGameIndex {
  game_index: number,
  generation: NameAndUrl,
}

export interface Name {
  name: string,
  language: NameAndUrl,
}

export interface TypePokemon {
  slot: number,
  pokemon: NameAndUrl
}

export interface Types {
  id: number,
  name: string,
  damage_relations: TypeRelations,
  past_damage_relations: Array<TypeRelationsPast>,
  game_indices: Array<GenerationGameIndex>,
  generation: NameAndUrl,
  move_damage_class: NameAndUrl,
  names: Array<Name>,
  pokemon: Array<TypePokemon>,
  moves: Array<NameAndUrl>
}

export interface BoolMap {
  [key: string]: boolean,
}

export interface StringMap {
  [key: string]: string,
}

export interface NumberMap {
  [key: string]: number,
}

export interface StringArrayMap {
  [key: string]: Array<string>,
}

export interface EvolutionFinalMap {
  [key: string]: Array<Array<string>>
}