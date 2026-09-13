import Collectible from "../models/Collectible.js";
import UserCollectible from "../models/UserCollectible.js";
import ApiError from "../utils/ApiError.js";
import { spendCoins } from "./coin.service.js";
import { createActivity } from "./activity.service.js";

export async function purchaseCollectible(userId, collectibleId) {
  const collectible = await Collectible.findById(collectibleId);

  if (!collectible) {
    throw new ApiError(404, "Collectible not found");
  }

  const alreadyOwned = await UserCollectible.findOne({
    userId,
    collectible: collectible._id,
  });

  if (alreadyOwned) {
    throw new ApiError(409, "Collectible already owned");
  }

  await spendCoins(
    userId,
    collectible.price,
    `Purchased ${collectible.name}`
  );

  const owned = await UserCollectible.create({
    userId,
    collectible: collectible._id,
    acquiredFrom: "purchase",
  });

  await createActivity({
    userId,
    type: "collectible",
    description: `Obtained ${collectible.name}`,
    metadata: { collectibleId: collectible._id },
  });

  return owned.populate("collectible");
}
