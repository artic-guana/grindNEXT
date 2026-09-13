import mongoose from "mongoose";

const userAchievementSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    achievement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Achievement",
      required: true,
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
    },

    unlocked: {
      type: Boolean,
      default: false,
    },

    unlockedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

userAchievementSchema.index(
  { userId: 1, achievement: 1 },
  { unique: true }
);

export default mongoose.model("UserAchievement", userAchievementSchema);
