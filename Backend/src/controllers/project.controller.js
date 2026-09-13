import Project from "../models/Project.js";
import Task from "../models/Task.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { projectXpFromPriority } from "../utils/xp.js";
import { grantXp } from "../services/xp.service.js";
import { touchStreak } from "../services/streak.service.js";
import { checkAchievements } from "../services/achievement.service.js";
import { createActivity } from "../services/activity.service.js";

async function syncProgress(projectId, userId) {
  const [total, done] = await Promise.all([
    Task.countDocuments({ project: projectId, userId }),
    Task.countDocuments({ project: projectId, userId, status: "done" }),
  ]);

  const progress = total === 0 ? 0 : Math.round((done / total) * 100);

  return Project.findOneAndUpdate(
    { _id: projectId, userId },
    { progress },
    { new: true }
  );
}

export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ userId: req.user.id }).sort({
    createdAt: -1,
  });

  const output = await Promise.all(
    projects.map(async (project) => {
      const tasks = await Task.find({
        userId: req.user.id,
        project: project._id,
      }).sort({ createdAt: 1 });

      return {
        ...project.toObject(),
        tasks,
      };
    })
  );

  res.json(output);
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });

  if (!project) throw new ApiError(404, "Project not found");

  const tasks = await Task.find({
    userId: req.user.id,
    project: project._id,
  });

  res.json({
    ...project.toObject(),
    tasks,
  });
});

export const createProject = asyncHandler(async (req, res) => {
  const priority = req.body.priority || "medium";

  const project = await Project.create({
    userId: req.user.id,
    name: req.body.name,
    description: req.body.description || "",
    priority,
    dueDate: req.body.dueDate || null,
    xpReward:
      req.body.xpReward !== undefined
        ? req.body.xpReward
        : projectXpFromPriority(priority),
  });

  res.status(201).json(project);
});

export const updateProject = asyncHandler(async (req, res) => {
  const allowed = [
    "name",
    "description",
    "priority",
    "dueDate",
    "xpReward",
    "status",
  ];

  const update = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) update[key] = req.body[key];
  }

  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    update,
    { new: true, runValidators: true }
  );

  if (!project) throw new ApiError(404, "Project not found");

  await syncProgress(project._id, req.user.id);
  res.json(project);
});

export const syncProjectProgress = asyncHandler(async (req, res) => {
  const project = await syncProgress(req.params.id, req.user.id);
  if (!project) throw new ApiError(404, "Project not found");

  res.json(project);
});

export const completeProject = asyncHandler(async (req, res) => {
  const project = await syncProgress(req.params.id, req.user.id);
  if (!project) throw new ApiError(404, "Project not found");

  if (project.status === "completed") {
    return res.json(project);
  }

  project.status = "completed";
  project.progress = 100;
  project.completedAt = new Date();
  await project.save();

  await grantXp(
    req.user.id,
    project.xpReward,
    `Completed project: ${project.name}`
  );

  await touchStreak(req.user.id);

  await createActivity({
    userId: req.user.id,
    type: "project",
    description: `Completed project: ${project.name}`,
    metadata: { projectId: project._id },
  });

  await checkAchievements(req.user.id);
  res.json(project);
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id,
  });

  if (!project) throw new ApiError(404, "Project not found");

  await Task.updateMany(
    { userId: req.user.id, project: project._id },
    { $set: { project: null } }
  );

  res.json({ message: "Project deleted" });
});
