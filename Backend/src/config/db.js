import mongoose from "mongoose";
import { MongoClient } from "mongodb";
import { env } from "./env.js";

export const mongoClient = new MongoClient(env.MONGO_URI);
export const nativeDb = mongoClient.db();

export async function connectDB() {
  await Promise.all([
    mongoose.connect(env.MONGO_URI),
    mongoClient.connect(),
  ]);

  console.log(`MongoDB connected: ${mongoose.connection.host}`);
}
