import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

import { nativeDb } from "../config/db.js";
import { env } from "../config/env.js";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,

  secret: env.BETTER_AUTH_SECRET,

  database: mongodbAdapter(nativeDb),

  emailAndPassword: {
    enabled: true,
  },

  trustedOrigins: [
    env.CLIENT_URL,
    env.CLIENT_URL2,
  ].filter(Boolean),

  advanced: {
    database: {
      joins: false,
    },

    useSecureCookies: true,

    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  },
});