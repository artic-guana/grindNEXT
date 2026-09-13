import Profile from "../models/Profile.js";
import { getLevelState } from "../utils/level.js";

export async function ensureProfile(user) {
  let profile = await Profile.findOne({ userId: user.id });

  if (!profile) {
    const levelState = getLevelState(0);

    profile = await Profile.create({
      userId: user.id,
      name: user.name || user.email?.split("@")[0] || "User",
      avatar: user.image || "",
      ...levelState,
    });
  }

  return profile;
}
