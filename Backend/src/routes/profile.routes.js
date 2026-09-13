import express from "express";
import {
  getMyProfile,
  updateProfile,
} from "../controllers/profile.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.get("/me", getMyProfile);
router.patch("/me", updateProfile);

export default router;
