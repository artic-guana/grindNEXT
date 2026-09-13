import Activity from "../models/Activity.js";

export function createActivity({
  userId,
  type,
  description,
  xpChange = 0,
  coinChange = 0,
  metadata = {},
}) {
  return Activity.create({
    userId,
    type,
    description,
    xpChange,
    coinChange,
    metadata,
  });
}
