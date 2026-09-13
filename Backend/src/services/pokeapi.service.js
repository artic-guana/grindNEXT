const POKE_API =
  "https://pokeapi.co/api/v2";

export async function getPokemon(nameOrId) {
  const value = String(nameOrId)
    .trim()
    .toLowerCase();

  const response = await fetch(
    `${POKE_API}/pokemon/${encodeURIComponent(value)}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }

    throw new Error(
      `PokéAPI request failed: ${response.status}`
    );
  }

  return response.json();
}