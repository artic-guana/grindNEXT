import Skill from "../models/Skill.js";
import ApiError from "../utils/ApiError.js";
import { createActivity } from "./activity.service.js";

export async function addSkillXp(userId, skillId, amount) {
  const skill = await Skill.findOne({ _id: skillId, userId });
  if (!skill) throw new ApiError(404, "Skill not found");

  const xp = Math.max(0, Math.floor(Number(amount) || 0));
  skill.xp += xp;

  while (skill.xp >= skill.target) {
    skill.xp -= skill.target;
    skill.level += 1;
    skill.target = Math.round(skill.target * 1.25);
  }

  await skill.save();

  await createActivity({
    userId,
    type: "skill",
    description: `${skill.name} gained ${xp} XP`,
    xpChange: xp,
    metadata: { skillId: skill._id },
  });

  return skill;
}
