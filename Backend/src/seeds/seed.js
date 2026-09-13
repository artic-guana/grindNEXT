import "dotenv/config";

import mongoose from "mongoose";

import {
  connectDB,
  mongoClient,
  nativeDb,
} from "../config/db.js";

import {
  seedAchievements,
} from "./achievements.seed.js";

import {
  seedCollectibles,
} from "./collectibles.seed.js";

import {
  seedDemoUser,
} from "./demoUser.seed.js";


async function seed() {
  try {
    await connectDB();

    await seedAchievements();
    await seedCollectibles();

    const demoUser = await nativeDb
      .collection("user")
      .findOne({
        email: "demo@grindnext.app",
      });

    if (!demoUser) {
      console.log("");
      console.log("Demo Better Auth account not found.");
      console.log(
        "Register demo@grindnext.app first, then run npm run seed again."
      );
    } else {
      await seedDemoUser(
        String(demoUser._id)
      );
    }

    console.log("✓ Database seeding completed");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();

    try {
      await mongoClient.close();
    } catch {}
  }
}

seed();