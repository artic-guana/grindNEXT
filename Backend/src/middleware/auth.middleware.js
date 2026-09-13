import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../services/auth.service.js";
import ApiError from "../utils/ApiError.js";

export async function protect(req, res, next) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
      throw new ApiError(401, "Unauthorized");
    }

    req.user = session.user;
    req.session = session.session;

    next();
  } catch (error) {
    next(
      error instanceof ApiError
        ? error
        : new ApiError(401, "Unauthorized")
    );
  }
}
