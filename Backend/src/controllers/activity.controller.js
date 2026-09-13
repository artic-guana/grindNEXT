import Activity from "../models/Activity.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getActivities = asyncHandler(async (req, res) => {
  const limit = Math.min(100, Math.max(1, Number(req.query.limit || 20)));

  const activities = await Activity.find({
    userId: req.user.id,
  })
    .sort({ createdAt: -1 })
    .limit(limit);

  res.json(activities);
});
