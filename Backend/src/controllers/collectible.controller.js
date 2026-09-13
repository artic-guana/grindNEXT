import Collectible from "../models/Collectible.js";
import UserCollectible from "../models/UserCollectible.js";
import Profile from "../models/Profile.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { purchaseCollectible } from "../services/collectible.service.js";

export const getCollectibles = asyncHandler(async (req, res) => {
  const filter = {};

  for (const key of ["category", "type", "rarity"]) {
    if (req.query[key]) filter[key] = req.query[key];
  }

  const items = await Collectible.find(filter).sort({
    rarity: 1,
    price: 1,
  });

  res.json(items);
});

export const getMyCollectibles = asyncHandler(async (req, res) => {
  const items = await UserCollectible.find({
    userId: req.user.id,
  }).populate("collectible");

  res.json(items);
});

export const buyCollectible = asyncHandler(async (req, res) => {
  const owned = await purchaseCollectible(req.user.id, req.params.id);
  res.status(201).json(owned);
});

export const equipCollectible = asyncHandler(async (req, res) => {
  const owned = await UserCollectible.findOne({
    _id: req.params.id,
    userId: req.user.id,
  }).populate("collectible");

  if (!owned) throw new ApiError(404, "Owned collectible not found");

  const field =
    owned.collectible.category === "pokemon"
      ? "equippedPokemon"
      : "equippedCharacter";

  const profile = await Profile.findOneAndUpdate(
    { userId: req.user.id },
    { [field]: owned._id },
    { new: true }
  )
    .populate({
      path: "equippedCharacter",
      populate: { path: "collectible" },
    })
    .populate({
      path: "equippedPokemon",
      populate: { path: "collectible" },
    });

  res.json(profile);
});
