import Skill from "../models/Skill.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { addSkillXp } from "../services/skill.service.js";

export const getSkills = asyncHandler(async (req, res) => {
  const skills = await Skill.find({ userId: req.user.id }).sort({
    level: -1,
    xp: -1,
  });

  res.json(skills);
});

export const createSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.create({
    userId: req.user.id,
    name: req.body.name,
    category: req.body.category || "other",
  });

  res.status(201).json(skill);
});

export const updateSkill = asyncHandler(async (req, res) => {
  const allowed = ["name", "category"];
  const update = {};

  for (const key of allowed) {
    if (req.body[key] !== undefined) update[key] = req.body[key];
  }

  const skill = await Skill.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    update,
    { new: true, runValidators: true }
  );

  if (!skill) throw new ApiError(404, "Skill not found");
  res.json(skill);
});

export const gainSkillXp = asyncHandler(async (req, res) => {
  const skill = await addSkillXp(
    req.user.id,
    req.params.id,
    req.body.amount
  );

  res.json(skill);
});

export const deleteSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id,
  });

  if (!skill) throw new ApiError(404, "Skill not found");
  res.json({ message: "Skill deleted" });
});
