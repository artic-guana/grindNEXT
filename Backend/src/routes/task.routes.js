import express from "express";
import {
  getTasks,
  createTask,
  updateTask,
  completeTask,
  deleteTask,
} from "../controllers/task.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.route("/").get(getTasks).post(createTask);
router.patch("/:id/complete", completeTask);
router.route("/:id").patch(updateTask).delete(deleteTask);

export default router;
