import { env } from "../config/env.js";

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || "Internal server error",
    details: err.details || undefined,
    stack: env.NODE_ENV === "development" ? err.stack : undefined,
  });
}
