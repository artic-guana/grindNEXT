import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    // Better Auth user ID.
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    bio: {
      type: String,
      default: "",
      maxlength: 300,
    },

    avatar: {
      type: String,
      default: "",
    },

    level: {
      type: Number,
      default: 1,
      min: 1,
    },

    currentXp: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalXp: {
      type: Number,
      default: 0,
      min: 0,
    },

    nextLevelXp: {
      type: Number,
      default: 500,
      min: 1,
    },

    coins: {
      type: Number,
      default: 0,
      min: 0,
    },

    streak: {
      type: Number,
      default: 0,
      min: 0,
    },

    maxStreak: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastActiveDate: {
      type: Date,
      default: null,
    },

    equippedCharacter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserCollectible",
      default: null,
    },

    equippedPokemon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserCollectible",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
