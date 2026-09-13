// Better Auth manages session cookies/tokens.
// Keep this file as the single place for any future non-auth tokens.
export function randomToken(length = 32) {
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let value = "";
  for (let i = 0; i < length; i += 1) {
    value += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return value;
}
