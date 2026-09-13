import Achievement from "../models/Achievement.js";

const achievements = [
  {
    key: "first_step",
    name: "First Step",
    description: "Complete your first task.",
    icon: "Footprints",
    category: "task",
    requirement: 1,
    xpReward: 50,
    coinReward: 25,
  },
  {
    key: "getting_things_done",
    name: "Getting Things Done",
    description: "Complete 10 tasks.",
    icon: "Circle-check-big",
    category: "task",
    requirement: 10,
    xpReward: 150,
    coinReward: 75,
  },
  {
    key: "task_slayer",
    name: "Task Slayer",
    description: "Complete 50 tasks.",
    icon: "Swords",
    category: "task",
    requirement: 50,
    xpReward: 500,
    coinReward: 250,
  },
  {
    key: "centurion",
    name: "Centurion",
    description: "Complete 100 tasks.",
    icon: "Crown",
    category: "task",
    requirement: 100,
    xpReward: 1000,
    coinReward: 500,
  },

  {
    key: "project_initiate",
    name: "Project Initiate",
    description: "Complete your first project.",
    icon: "Folder-check",
    category: "project",
    requirement: 1,
    xpReward: 100,
    coinReward: 50,
  },
  {
    key: "project_master",
    name: "Project Master",
    description: "Complete 10 projects.",
    icon: "Briefcase-business",
    category: "project",
    requirement: 10,
    xpReward: 750,
    coinReward: 350,
  },

  {
    key: "three_day_flame",
    name: "Three Day Flame",
    description: "Maintain a 3 day productivity streak.",
    icon: "Flame",
    category: "streak",
    requirement: 3,
    xpReward: 100,
    coinReward: 50,
  },
  {
    key: "week_warrior",
    name: "Week Warrior",
    description: "Maintain a 7 day productivity streak.",
    icon: "Flame",
    category: "streak",
    requirement: 7,
    xpReward: 250,
    coinReward: 100,
  },
  {
    key: "unstoppable",
    name: "Unstoppable",
    description: "Maintain a 30 day productivity streak.",
    icon: "Zap",
    category: "streak",
    requirement: 30,
    xpReward: 1000,
    coinReward: 500,
  },

  {
    key: "level_up",
    name: "Level Up",
    description: "Reach level 2.",
    icon: "Chevrons-up",
    category: "level",
    requirement: 2,
    xpReward: 50,
    coinReward: 25,
  },
  {
    key: "rising_hero",
    name: "Rising Hero",
    description: "Reach level 5.",
    icon: "Shield",
    category: "level",
    requirement: 5,
    xpReward: 300,
    coinReward: 150,
  },
  {
    key: "grindnext_veteran",
    name: "GrindNEXT Veteran",
    description: "Reach level 10.",
    icon: "Trophy",
    category: "level",
    requirement: 10,
    xpReward: 1000,
    coinReward: 500,
  },

  {
    key: "skill_apprentice",
    name: "Skill Apprentice",
    description: "Reach level 2 in any skill.",
    icon: "Brain",
    category: "skill",
    requirement: 2,
    xpReward: 100,
    coinReward: 50,
  },
  {
    key: "skill_master",
    name: "Skill Master",
    description: "Reach level 5 in any skill.",
    icon: "Sparkles",
    category: "skill",
    requirement: 5,
    xpReward: 500,
    coinReward: 250,
  },

  {
    key: "collector",
    name: "Collector",
    description: "Own your first collectible.",
    icon: "Gem",
    category: "collectible",
    requirement: 1,
    xpReward: 100,
    coinReward: 25,
  },
  {
    key: "gotta_collect_em",
    name: "Gotta Collect 'Em",
    description: "Own 5 collectibles.",
    icon: "Package-open",
    category: "collectible",
    requirement: 5,
    xpReward: 300,
    coinReward: 150,
  },
];

export async function seedAchievements() {
  console.log("Seeding achievements...");

  for (const achievement of achievements) {
    await Achievement.findOneAndUpdate(
      {
        key: achievement.key,
      },
      {
        $set: achievement,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
  }

  console.log(
    `✓ ${achievements.length} achievements seeded`
  );
}