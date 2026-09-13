import Task from "../models/Task.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { taskXpFromPriority } from "../utils/xp.js";
import { grantXp } from "../services/xp.service.js";
import { touchStreak } from "../services/streak.service.js";
import { checkAchievements } from "../services/achievement.service.js";
import { createActivity } from "../services/activity.service.js";

export const getTasks = asyncHandler(async (req, res) => {
  const filter = { userId: req.user.id };

  if (req.query.status) filter.status = req.query.status;
  if (req.query.project) filter.project = req.query.project;

  const tasks = await Task.find(filter)
    .populate("project", "name priority progress")
    .sort({ createdAt: -1 });

  res.json(tasks);
});

export const createTask = asyncHandler(async (req, res) => {
  const priority = req.body.priority || "medium";

  const task = await Task.create({
    userId: req.user.id,
    title: req.body.title,
    description: req.body.description || "",
    priority,
    status: req.body.status || "todo",
    dueDate: req.body.dueDate || null,
    tags: req.body.tags || [],
    project: req.body.project || null,
    xpReward:
      req.body.xpReward !== undefined
        ? req.body.xpReward
        : taskXpFromPriority(priority),
  });

  res.status(201).json(task);
});

export const updateTask = asyncHandler(async (req, res) => {
  const allowed = [
    "title",
    "description",
    "status",
    "priority",
    "dueDate",
    "tags",
    "project",
    "xpReward",
  ];

  const update = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) update[key] = req.body[key];
  }

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    update,
    { new: true, runValidators: true }
  );

  if (!task) throw new ApiError(404, "Task not found");
  res.json(task);
});

export const completeTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });

  if (!task) throw new ApiError(404, "Task not found");

  // Idempotent: don't grant XP twice.
  if (task.status === "done") {
    return res.json(task);
  }

  task.status = "done";
  task.completedAt = new Date();
  await task.save();

  await grantXp(
    req.user.id,
    task.xpReward,
    `Completed task: ${task.title}`
  );

  await touchStreak(req.user.id);

  await createActivity({
    userId: req.user.id,
    type: "task",
    description: `Completed ${task.title}`,
    metadata: { taskId: task._id },
  });

  await checkAchievements(req.user.id);

  res.json(task);
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id,
  });

  if (!task) throw new ApiError(404, "Task not found");
  res.json({ message: "Task deleted" });
});
