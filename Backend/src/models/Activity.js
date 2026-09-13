import mongoose from "mongoose";
import { ACTIVITY_TYPES } from "../utils/constants.js";

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ACTIVITY_TYPES,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    xpChange: {
      type: Number,
      default: 0,
    },

    coinChange: {
      type: Number,
      default: 0,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
