import Profile from "../models/Profile.js";
import ApiError from "../utils/ApiError.js";
import { createActivity } from "./activity.service.js";

function utcDateOnly(date = new Date()) {
  return Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  );
}

export async function touchStreak(userId, now = new Date()) {
  const profile = await Profile.findOne({ userId });
  if (!profile) throw new ApiError(404, "Profile not found");

  const today = utcDateOnly(now);

  if (!profile.lastActiveDate) {
    profile.streak = 1;
  } else {
    const last = utcDateOnly(new Date(profile.lastActiveDate));
    const days = Math.round((today - last) / 86_400_000);

    if (days === 0) return profile;
    if (days === 1) profile.streak += 1;
    if (days > 1) profile.streak = 1;
  }

  profile.maxStreak = Math.max(profile.maxStreak, profile.streak);
  profile.lastActiveDate = now;
  await profile.save();

  await createActivity({
    userId,
    type: "streak",
    description: `${profile.streak}-day streak`,
    metadata: {
      streak: profile.streak,
      maxStreak: profile.maxStreak,
    },
  });

  return profile;
}
