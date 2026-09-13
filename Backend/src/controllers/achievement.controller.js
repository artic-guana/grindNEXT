import Achievement from "../models/Achievement.js";
import UserAchievement from "../models/UserAchievement.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { checkAchievements } from "../services/achievement.service.js";

export const getAchievements = asyncHandler(async (req, res) => {
  const definitions = await Achievement.find().sort({ conditionValue: 1 });
  res.json(definitions);
});

export const getMyAchievements = asyncHandler(async (req, res) => {
  await checkAchievements(req.user.id);

  const states = await UserAchievement.find({
    userId: req.user.id,
  }).populate("achievement");

  res.json(states);
});

export const recheckAchievements = asyncHandler(async (req, res) => {
  const unlocked = await checkAchievements(req.user.id);
  res.json({ unlocked });
});
