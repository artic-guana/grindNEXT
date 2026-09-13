import express from "express";
import {
  getCollectibles,
  getMyCollectibles,
  buyCollectible,
  equipCollectible,
} from "../controllers/collectible.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getCollectibles);
router.get("/me", protect, getMyCollectibles);
router.post("/:id/buy", protect, buyCollectible);
router.patch("/owned/:id/equip", protect, equipCollectible);

export default router;
