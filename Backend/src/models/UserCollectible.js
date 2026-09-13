import mongoose from "mongoose";

const userCollectibleSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    collectible: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collectible",
      required: true,
    },

    level: {
      type: Number,
      default: 1,
      min: 1,
    },

    xp: {
      type: Number,
      default: 0,
      min: 0,
    },

    nickname: {
      type: String,
      trim: true,
      maxlength: 30,
      default: null,
    },

    shiny: {
      type: Boolean,
      default: false,
    },

    acquiredFrom: {
      type: String,
      enum: ["purchase", "reward", "drop", "event", "starter"],
      default: "purchase",
    },

    acquiredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

userCollectibleSchema.index(
  { userId: 1, collectible: 1 },
  { unique: true }
);

export default mongoose.model("UserCollectible", userCollectibleSchema);
