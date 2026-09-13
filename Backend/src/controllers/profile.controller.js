import Profile from "../models/Profile.js";
import Skill from "../models/Skill.js";
import UserAchievement from "../models/UserAchievement.js";
import Activity from "../models/Activity.js";
import UserCollectible from "../models/UserCollectible.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ensureProfile } from "../services/profile.service.js";

export const getMyProfile = asyncHandler(async (req, res) => {
  await ensureProfile(req.user);

  const [profile, skills, achievements, recentActivity, collectibles] =
    await Promise.all([
      Profile.findOne({ userId: req.user.id })
        .populate({
          path: "equippedCharacter",
          populate: { path: "collectible" },
        })
        .populate({
          path: "equippedPokemon",
          populate: { path: "collectible" },
        }),
      Skill.find({ userId: req.user.id }).sort({ level: -1 }),
      UserAchievement.find({
        userId: req.user.id,
        unlocked: true,
      }).populate("achievement"),
      Activity.find({ userId: req.user.id })
        .sort({ createdAt: -1 })
        .limit(20),
      UserCollectible.find({ userId: req.user.id }).populate("collectible"),
    ]);

  res.json({
    profile,
    skills,
    achievements,
    recentActivity,
    collectibles,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ["name", "bio", "avatar"];
  const update = {};

  for (const key of allowed) {
    if (req.body[key] !== undefined) update[key] = req.body[key];
  }

  const profile = await Profile.findOneAndUpdate(
    { userId: req.user.id },
    update,
    { new: true, runValidators: true }
  );

  res.json(profile);
});
