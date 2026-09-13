import Profile from "../models/Profile.js";
import ApiError from "../utils/ApiError.js";
import { createActivity } from "./activity.service.js";

export async function addCoins(userId, amount, reason = "Coins earned") {
  const value = Math.max(0, Math.floor(Number(amount) || 0));

  const profile = await Profile.findOneAndUpdate(
    { userId },
    { $inc: { coins: value } },
    { new: true }
  );

  if (!profile) throw new ApiError(404, "Profile not found");

  await createActivity({
    userId,
    type: "coin",
    description: reason,
    coinChange: value,
  });

  return profile;
}

export async function spendCoins(userId, amount, reason = "Coins spent") {
  const value = Math.max(0, Math.floor(Number(amount) || 0));

  const profile = await Profile.findOne({ userId });
  if (!profile) throw new ApiError(404, "Profile not found");

  if (profile.coins < value) {
    throw new ApiError(400, "Not enough coins");
  }

  profile.coins -= value;
  await profile.save();

  await createActivity({
    userId,
    type: "coin",
    description: reason,
    coinChange: -value,
  });

  return profile;
}
