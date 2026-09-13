import { asyncHandler } from "../utils/asyncHandler.js";
import { ensureProfile } from "../services/profile.service.js";

// Better Auth handles:
// POST /api/auth/sign-up/email
// POST /api/auth/sign-in/email
// POST /api/auth/sign-out
// GET  /api/auth/get-session
//
// This app endpoint exists to return the session and guarantee a Profile.
export const getMe = asyncHandler(async (req, res) => {
  const profile = await ensureProfile(req.user);

  res.json({
    user: req.user,
    session: req.session,
    profile,
  });
});
