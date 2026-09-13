import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      default: "other",
      trim: true,
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

    target: {
      type: Number,
      default: 100,
      min: 1,
    },
  },
  { timestamps: true }
);

skillSchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.model("Skill", skillSchema);
