import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

import { env } from "./config/env.js";
import { auth } from "./services/auth.service.js";
import apiRoutes from "./routes/index.js";
import { notFound } from "./middleware/notFound.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

// IMPORTANT: Better Auth must be mounted BEFORE express.json().
// Express 5 catch-all syntax:
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/v1", apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
