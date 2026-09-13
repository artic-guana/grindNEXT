import express from "express";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  syncProjectProgress,
  completeProject,
  deleteProject,
} from "../controllers/project.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.route("/").get(getProjects).post(createProject);
router.patch("/:id/progress", syncProjectProgress);
router.patch("/:id/complete", completeProject);
router
  .route("/:id")
  .get(getProject)
  .patch(updateProject)
  .delete(deleteProject);

export default router;
