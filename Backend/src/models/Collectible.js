import mongoose from "mongoose";
import { COLLECTIBLE_RARITIES } from "../utils/constants.js";

const collectibleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["anime", "pokemon"],
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["hero", "waifu", "pokemon"],
      required: true,
      index: true,
    },

    image: {
      type: String,
      required: true,
    },

    animatedImage: {
      type: String,
      default: null,
    },

    rarity: {
      type: String,
      enum: COLLECTIBLE_RARITIES,
      default: "common",
      index: true,
    },

    price: {
      type: Number,
      default: 0,
      min: 0,
    },

    source: {
      type: String,
      enum: ["anilist", "pokeapi", "custom"],
      required: true,
    },

    externalId: {
      type: String,
      default: null,
    },

    anime: {
      title: { type: String, default: null },
      gender: { type: String, default: null },
    },

    pokemon: {
      types: [{ type: String }],
      baseStats: {
        hp: { type: Number, default: null },
        attack: { type: Number, default: null },
        defense: { type: Number, default: null },
        speed: { type: Number, default: null },
      },
    },
  },
  { timestamps: true }
);

collectibleSchema.index(
  { source: 1, externalId: 1 },
  { unique: true, sparse: true }
);

export default mongoose.model("Collectible", collectibleSchema);
