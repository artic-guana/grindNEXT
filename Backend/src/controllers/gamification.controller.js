import { asyncHandler } from "../utils/asyncHandler.js";
import { getGamificationOverview } from "../services/gamification.service.js";
import { touchStreak } from "../services/streak.service.js";

export const getOverview = asyncHandler(async (req, res) => {
  const overview = await getGamificationOverview(req.user.id);
  res.json(overview);
});

export const recordDailyActivity = asyncHandler(async (req, res) => {
  const profile = await touchStreak(req.user.id);
  res.json({
    streak: profile.streak,
    maxStreak: profile.maxStreak,
  });
});
