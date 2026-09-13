import express from "express";
import {
  getSkills,
  createSkill,
  updateSkill,
  gainSkillXp,
  deleteSkill,
} from "../controllers/skill.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getSkills).post(createSkill);
router.patch("/:id/xp", gainSkillXp);
router.route("/:id").patch(updateSkill).delete(deleteSkill);

export default router;
