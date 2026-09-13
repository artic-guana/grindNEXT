import mongoose from "mongoose";

// Read-only view of Better Auth's `user` collection.
// Do NOT use this model for sign-up/password/session writes.
const userSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    email: String,
    emailVerified: Boolean,
    image: String,
  },
  {
    strict: false,
    versionKey: false,
  }
);

export default mongoose.model("AuthUser", userSchema, "user");
