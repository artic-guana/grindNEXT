import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    icon: {
      type: String,
      default: "🏆",
    },

    rarity: {
      type: String,
      enum: ["common", "rare", "epic", "legendary"],
      default: "common",
    },

    conditionType: {
      type: String,
      enum: [
        "level",
        "totalXp",
        "streak",
        "maxStreak",
        "tasksCompleted",
        "projectsCompleted",
        "skills",
        "collectibles",
      ],
      required: true,
    },

    conditionValue: {
      type: Number,
      required: true,
      min: 1,
    },

    xpReward: {
      type: Number,
      default: 0,
      min: 0,
    },

    coinReward: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Achievement", achievementSchema);
