import express from "express";
import {
  getPages,
  getPage,
  createPage,
  updatePage,
  deletePage,
} from "../controllers/page.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.route("/").get(getPages).post(createPage);
router.route("/:id").get(getPage).patch(updatePage).delete(deletePage);

export default router;
