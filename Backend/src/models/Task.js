import mongoose from "mongoose";
import { PRIORITIES, TASK_STATUS } from "../utils/constants.js";

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: TASK_STATUS,
      default: "todo",
      index: true,
    },

    priority: {
      type: String,
      enum: PRIORITIES,
      default: "medium",
    },

    dueDate: {
      type: Date,
      default: null,
    },

    tags: [{ type: String, trim: true }],

    xpReward: {
      type: Number,
      default: 25,
      min: 0,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
      index: true,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
