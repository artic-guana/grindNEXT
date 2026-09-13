// Deprecated for authentication: Better Auth owns auth/session tokens.
// This export exists only so old imports fail gracefully during migration.
export function generateToken() {
  throw new Error(
    "generateToken() is not used. Authentication is handled by Better Auth."
  );
}
