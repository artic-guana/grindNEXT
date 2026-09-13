import mongoose from "mongoose";
import { PRIORITIES } from "../utils/constants.js";

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    priority: {
      type: String,
      enum: PRIORITIES,
      default: "medium",
    },

    xpReward: {
      type: Number,
      default: 250,
      min: 0,
    },

    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
      index: true,
    },

    dueDate: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
