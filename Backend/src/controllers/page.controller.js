import Page from "../models/Page.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getPages = asyncHandler(async (req, res) => {
  const pages = await Page.find({
    userId: req.user.id,
    archived: false,
  }).sort({ updatedAt: -1 });

  res.json(pages);
});

export const getPage = asyncHandler(async (req, res) => {
  const page = await Page.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });

  if (!page) throw new ApiError(404, "Page not found");
  res.json(page);
});

export const createPage = asyncHandler(async (req, res) => {
  const page = await Page.create({
    userId: req.user.id,
    title: req.body.title || "Untitled",
    icon: req.body.icon || "📄",
    parentPage: req.body.parentPage || null,
    content: req.body.content || {},
  });

  res.status(201).json(page);
});

export const updatePage = asyncHandler(async (req, res) => {
  const allowed = [
    "title",
    "icon",
    "cover",
    "content",
    "parentPage",
    "archived",
  ];

  const update = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) update[key] = req.body[key];
  }

  const page = await Page.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    update,
    { new: true, runValidators: true }
  );

  if (!page) throw new ApiError(404, "Page not found");
  res.json(page);
});

export const deletePage = asyncHandler(async (req, res) => {
  const page = await Page.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id,
  });

  if (!page) throw new ApiError(404, "Page not found");
  res.json({ message: "Page deleted" });
});
