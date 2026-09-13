import Collectible from "../models/Collectible.js";

import {
  searchAniListCharacter,
} from "../services/anilist.service.js";

import {
  getPokemon,
} from "../services/pokeapi.service.js";


const collectibleDefinitions = [
  // =========================
  // ANIME CHARACTERS
  // =========================

  {
    name: "Eren Yeager",
    category: "anime",
    type: "hero",
    rarity: "legendary",
    price: 2500,
    source: "anilist",
  },

  {
    name: "Subaru Natsuki",
    category: "anime",
    type: "hero",
    rarity: "epic",
    price: 1500,
    source: "anilist",
  },

  {
    name: "Klein Moretti",
    category: "anime",
    type: "hero",
    rarity: "mythic",
    price: 5000,
    source: "anilist",
  },

  {
    name: "Emilia",
    category: "anime",
    type: "waifu",
    rarity: "legendary",
    price: 2500,
    source: "anilist",
  },

  {
    name: "Mikasa Ackerman",
    category: "anime",
    type: "waifu",
    rarity: "legendary",
    price: 2500,
    source: "anilist",
  },

  // =========================
  // POKEMON
  // =========================

  {
    name: "Pikachu",
    pokemonName: "pikachu",
    category: "pokemon",
    type: "pokemon",
    rarity: "rare",
    price: 800,
    source: "pokeapi",
  },

  {
    name: "Charizard",
    pokemonName: "charizard",
    category: "pokemon",
    type: "pokemon",
    rarity: "legendary",
    price: 3000,
    source: "pokeapi",
  },

  {
    name: "Eevee",
    pokemonName: "eevee",
    category: "pokemon",
    type: "pokemon",
    rarity: "rare",
    price: 800,
    source: "pokeapi",
  },
];


async function seedAnimeCharacter(definition) {
  try {
    console.log(
      `Fetching AniList: ${definition.name}`
    );

    const character = await searchAniListCharacter(
      definition.name
    );

    if (!character) {
      console.warn(
        `⚠ AniList character not found: ${definition.name}`
      );

      return;
    }

    const collectible = {
      name: definition.name,

      category: definition.category,
      type: definition.type,

      rarity: definition.rarity,
      price: definition.price,

      source: "anilist",

      externalId: String(character.id),

      image:
        character.image?.large ||
        character.image?.medium ||
        null,

      animatedImage: null,

      anime: {
        characterName:
          character.name?.full ||
          definition.name,

        nativeName:
          character.name?.native ||
          null,

        gender:
          character.gender ||
          null,

        media:
          character.media?.nodes?.map(
            (media) => ({
              id: media.id,
              title:
                media.title?.english ||
                media.title?.romaji ||
                media.title?.native ||
                "",
            })
          ) || [],
      },
    };

    await Collectible.findOneAndUpdate(
      {
        source: "anilist",
        externalId: collectible.externalId,
      },
      {
        $set: collectible,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    console.log(
      `✓ Seeded ${definition.name}`
    );
  } catch (error) {
    console.error(
      `✗ Failed to seed ${definition.name}:`,
      error.message
    );
  }
}


async function seedPokemon(definition) {
  try {
    console.log(
      `Fetching PokéAPI: ${definition.name}`
    );

    const pokemon = await getPokemon(
      definition.pokemonName
    );

    if (!pokemon) {
      console.warn(
        `⚠ Pokémon not found: ${definition.name}`
      );

      return;
    }

    const collectible = {
      name: definition.name,

      category: "pokemon",
      type: "pokemon",

      rarity: definition.rarity,
      price: definition.price,

      source: "pokeapi",

      externalId: String(pokemon.id),

      image:
        pokemon.sprites?.other?.[
          "official-artwork"
        ]?.front_default ||
        pokemon.sprites?.front_default ||
        null,

      animatedImage:
        pokemon.sprites?.other?.showdown
          ?.front_default ||
        null,

      pokemon: {
        pokemonId: pokemon.id,

        types:
          pokemon.types?.map(
            (entry) => entry.type.name
          ) || [],

        baseStats:
          pokemon.stats?.reduce(
            (result, stat) => {
              result[stat.stat.name] =
                stat.base_stat;

              return result;
            },
            {}
          ) || {},
      },
    };

    await Collectible.findOneAndUpdate(
      {
        source: "pokeapi",
        externalId: collectible.externalId,
      },
      {
        $set: collectible,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    console.log(
      `✓ Seeded ${definition.name}`
    );
  } catch (error) {
    console.error(
      `✗ Failed to seed ${definition.name}:`,
      error.message
    );
  }
}


export async function seedCollectibles() {
  console.log("Seeding collectibles...");

  for (const definition of collectibleDefinitions) {
    if (definition.source === "anilist") {
      await seedAnimeCharacter(definition);
    }

    if (definition.source === "pokeapi") {
      await seedPokemon(definition);
    }
  }

  console.log("✓ Collectible seeding complete");
}