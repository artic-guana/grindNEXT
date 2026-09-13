import Profile from "../models/Profile.js";
import Skill from "../models/Skill.js";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import UserAchievement from "../models/UserAchievement.js";
import UserCollectible from "../models/UserCollectible.js";
import { getLevelState } from "../utils/level.js";

export async function getGamificationOverview(userId) {
  const [
    profile,
    skills,
    tasksCompleted,
    projectsCompleted,
    achievementsUnlocked,
    collectibles,
  ] = await Promise.all([
    Profile.findOne({ userId }),
    Skill.find({ userId }).sort({ level: -1, xp: -1 }),
    Task.countDocuments({ userId, status: "done" }),
    Project.countDocuments({ userId, status: "completed" }),
    UserAchievement.countDocuments({ userId, unlocked: true }),
    UserCollectible.countDocuments({ userId }),
  ]);

  const state = getLevelState(profile?.totalXp || 0);

  return {
    profile: {
      ...profile?.toObject(),
      levelProgress: state.progressPercent,
    },
    stats: {
      tasksCompleted,
      projectsCompleted,
      achievementsUnlocked,
      collectibles,
    },

    // Feed this directly to Chart.js / react-chartjs-2.
    skillChart: {
      labels: skills.map((skill) => skill.name),
      datasets: [
        {
          label: "Skill Level",
          data: skills.map((skill) => skill.level),
        },
      ],
    },
  };
}
