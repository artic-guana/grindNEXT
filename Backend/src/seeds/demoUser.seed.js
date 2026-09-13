// src/seeds/demoUser.seed.js

import Profile from "../models/Profile.js";
import Skill from "../models/Skill.js";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import UserCollectible from "../models/UserCollectible.js";
import Collectible from "../models/Collectible.js";

export async function seedDemoUser(userId) {
  if (!userId) {
    throw new Error("Demo userId is required");
  }

  console.log("Seeding demo user data...");

  const profile = await Profile.findOneAndUpdate(
    { userId },
    {
      $set: {
        userId,
        name: "Demo Player",
        bio: "Building consistency one quest at a time.",
        level: 4,
        currentXp: 320,
        totalXp: 2100,
        nextLevelXp: 875,
        coins: 1850,
        streak: 7,
        maxStreak: 12,
        lastActiveDate: new Date(),
      },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  await Skill.deleteMany({ userId });

  await Skill.insertMany([
    {
      userId,
      name: "Data Structures & Algorithms",
      category: "Programming",
      level: 4,
      xp: 280,
      target: 400,
    },
    {
      userId,
      name: "React",
      category: "Frontend",
      level: 3,
      xp: 190,
      target: 320,
    },
    {
      userId,
      name: "Node.js",
      category: "Backend",
      level: 3,
      xp: 150,
      target: 320,
    },
    {
      userId,
      name: "MongoDB",
      category: "Database",
      level: 2,
      xp: 95,
      target: 250,
    },
    {
      userId,
      name: "Communication",
      category: "Soft Skills",
      level: 2,
      xp: 140,
      target: 250,
    },
  ]);

  await Project.deleteMany({ userId });

  const projects = await Project.insertMany([
    {
      userId,
      name: "GrindNEXT MVP",
      description: "Build the first usable version of GrindNEXT.",
      priority: "high",
      status: "active",
      progress: 65,
      xpReward: 500,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    {
      userId,
      name: "DSA Sprint",
      description: "Complete a focused 30-day DSA practice sprint.",
      priority: "medium",
      status: "active",
      progress: 40,
      xpReward: 250,
      dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    },
  ]);

  await Task.deleteMany({ userId });

  await Task.insertMany([
    {
      userId,
      title: "Solve 3 sliding window problems",
      description: "Practice fixed and variable size sliding window.",
      status: "todo",
      priority: "high",
      xpReward: 50,
      project: projects[1]._id,
      tags: ["DSA", "Sliding Window"],
      dueDate: new Date(),
    },
    {
      userId,
      title: "Finish Shop UI",
      description: "Connect collectible cards with backend data.",
      status: "in-progress",
      priority: "high",
      xpReward: 50,
      project: projects[0]._id,
      tags: ["React", "Frontend"],
    },
    {
      userId,
      title: "Add project API",
      description: "Finish CRUD operations for projects.",
      status: "done",
      priority: "medium",
      xpReward: 25,
      project: projects[0]._id,
      tags: ["Backend", "Express"],
      completedAt: new Date(),
    },
  ]);

  const starterCollectible = await Collectible.findOne({
    name: "Pikachu",
  });

  if (starterCollectible) {
    let owned = await UserCollectible.findOne({
      userId,
      collectible: starterCollectible._id,
    });

    if (!owned) {
      owned = await UserCollectible.create({
        userId,
        collectible: starterCollectible._id,
        level: 1,
        xp: 0,
        nickname: "Sparky",
        shiny: false,
        acquiredFrom: "starter",
        acquiredAt: new Date(),
      });
    }

    profile.equippedPokemon = owned._id;
    await profile.save();
  }

  console.log("✓ Demo user data seeded");
}