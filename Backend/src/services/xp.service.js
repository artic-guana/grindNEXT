import Profile from "../models/Profile.js";
import ApiError from "../utils/ApiError.js";
import { clampXp } from "../utils/xp.js";
import { getLevelState } from "../utils/level.js";
import { createActivity } from "./activity.service.js";

export async function grantXp(userId, amount, reason = "XP earned") {
  const xp = clampXp(amount);
  if (!xp) return Profile.findOne({ userId });

  const profile = await Profile.findOne({ userId });
  if (!profile) throw new ApiError(404, "Profile not found");

  const oldLevel = profile.level;
  profile.totalXp += xp;

  const state = getLevelState(profile.totalXp);
  profile.level = state.level;
  profile.currentXp = state.currentXp;
  profile.nextLevelXp = state.nextLevelXp;

  await profile.save();

  await createActivity({
    userId,
    type: "xp",
    description: reason,
    xpChange: xp,
  });

  if (state.level > oldLevel) {
    await createActivity({
      userId,
      type: "level_up",
      description: `Reached level ${state.level}`,
    });
  }

  return profile;
}
