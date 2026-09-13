import Achievement from "../models/Achievement.js";
import UserAchievement from "../models/UserAchievement.js";

import Skill from "../models/Skill.js";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import UserCollectible from "../models/UserCollectible.js";
import Profile from "../models/Profile.js";

import { grantXp } from "./xp.service.js";
import { addCoins } from "./coin.service.js";
import { createActivity } from "./activity.service.js";


/**
 * Convert any value into a safe finite number.
 *
 * Prevents undefined, null or NaN values
 * from reaching MongoDB.
 */
function safeNumber(value, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}


/**
 * Resolve the achievement metric name.
 *
 * Supports both:
 *
 * Old schema:
 *   conditionType
 *
 * Current seeded schema:
 *   category
 */
function getMetricType(achievement) {
  if (achievement.conditionType) {
    return achievement.conditionType;
  }

  const categoryMap = {
    task: "tasksCompleted",
    project: "projectsCompleted",
    streak: "streak",
    level: "level",
    skill: "skillLevel",
    collectible: "collectibles",
  };

  return (
    categoryMap[achievement.category] ??
    achievement.category ??
    null
  );
}


/**
 * Resolve achievement target.
 *
 * Supports:
 *
 * old:
 *   conditionValue
 *
 * new:
 *   requirement
 */
function getRequirement(achievement) {
  return safeNumber(
    achievement.conditionValue ??
      achievement.requirement,
    0
  );
}


/**
 * Read the current user's value for
 * a particular achievement metric.
 */
async function metricValue(
  userId,
  type,
  profile = null
) {
  switch (type) {
    case "level":
      return safeNumber(
        profile?.level,
        1
      );


    case "totalXp":
      return safeNumber(
        profile?.totalXp,
        0
      );


    case "streak":
      return safeNumber(
        profile?.streak,
        0
      );


    case "maxStreak":
      return safeNumber(
        profile?.maxStreak,
        0
      );


    case "tasksCompleted":
    case "task":
      return Task.countDocuments({
        userId,
        status: "done",
      });


    case "projectsCompleted":
    case "project":
      return Project.countDocuments({
        userId,
        status: "completed",
      });


    /**
     * Number of skills created.
     */
    case "skills":
      return Skill.countDocuments({
        userId,
      });


    /**
     * Highest level among user's skills.
     *
     * This is what your seeded
     * "Skill Apprentice" / "Skill Master"
     * achievements actually need.
     */
    case "skillLevel":
    case "skill": {
      const highestSkill =
        await Skill.findOne({
          userId,
        })
          .sort({
            level: -1,
          })
          .select("level")
          .lean();

      return safeNumber(
        highestSkill?.level,
        0
      );
    }


    case "collectibles":
    case "collectible":
      return UserCollectible.countDocuments({
        userId,
      });


    default:
      console.warn(
        `Unknown achievement metric: ${type}`
      );

      return 0;
  }
}


/**
 * Check every achievement for a user.
 *
 * Returns only achievements that were
 * unlocked during this check.
 */
export async function checkAchievements(
  userId
) {
  if (!userId) {
    throw new Error(
      "userId is required to check achievements."
    );
  }


  const definitions =
    await Achievement.find({});

  if (!definitions.length) {
    return [];
  }


  const profile = await Profile.findOne({
    userId,
  }).lean();


  const unlockedNow = [];


  for (const achievement of definitions) {
    const metricType =
      getMetricType(achievement);

    const requirement =
      getRequirement(achievement);


    /**
     * Bad achievement definitions should not
     * crash the whole achievement system.
     */
    if (!metricType) {
      console.warn(
        `Achievement "${achievement.name}" has no metric type.`
      );

      continue;
    }


    if (requirement <= 0) {
      console.warn(
        `Achievement "${achievement.name}" has an invalid requirement:`,
        achievement.conditionValue ??
          achievement.requirement
      );

      continue;
    }


    const rawValue =
      await metricValue(
        userId,
        metricType,
        profile
      );


    const value =
      safeNumber(rawValue, 0);


    /**
     * Progress here represents the actual
     * milestone amount.
     *
     * Example:
     *
     * 4-day streak / required 7
     *
     * progress = 4
     *
     * rather than 57%.
     */
    const progress = Math.min(
      Math.max(value, 0),
      requirement
    );


    let state =
      await UserAchievement.findOne({
        userId,
        achievement:
          achievement._id,
      });


    if (!state) {
      state = new UserAchievement({
        userId,

        achievement:
          achievement._id,

        progress: 0,

        unlocked: false,

        unlockedAt: null,
      });
    }


    state.progress =
      safeNumber(progress, 0);


    /**
     * Unlock only once.
     *
     * This prevents users receiving
     * achievement XP/coins repeatedly.
     */
    if (
      !state.unlocked &&
      value >= requirement
    ) {
      state.unlocked = true;

      state.unlockedAt =
        new Date();

      unlockedNow.push(
        achievement
      );


      await createActivity({
        userId,

        type: "achievement",

        description:
          `Unlocked achievement: ${achievement.name}`,

        metadata: {
          achievementId:
            achievement._id,

          key:
            achievement.key ??
            null,

          progress:
            state.progress,

          requirement,
        },
      });
    }


    await state.save();
  }


  /**
   * Reward achievements only after every
   * achievement state has been updated.
   *
   * This helps avoid achievement checking
   * recursively while XP/coins are granted.
   */
  for (const achievement of unlockedNow) {
    const xpReward =
      safeNumber(
        achievement.xpReward,
        0
      );

    const coinReward =
      safeNumber(
        achievement.coinReward,
        0
      );


    if (xpReward > 0) {
      await grantXp(
        userId,
        xpReward,
        `Achievement reward: ${achievement.name}`
      );
    }


    if (coinReward > 0) {
      await addCoins(
        userId,
        coinReward,
        `Achievement reward: ${achievement.name}`
      );
    }
  }


  return unlockedNow;
}