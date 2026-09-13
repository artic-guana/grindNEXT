const ANILIST_URL =
  "https://graphql.anilist.co";

export async function searchAniListCharacter(name) {
  const query = `
    query ($search: String) {
      Character(search: $search) {
        id

        name {
          full
          native
        }

        image {
          large
          medium
        }

        gender

        media(perPage: 5) {
          nodes {
            id

            title {
              romaji
              english
              native
            }
          }
        }
      }
    }
  `;

  const response = await fetch(ANILIST_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },

    body: JSON.stringify({
      query,
      variables: {
        search: name,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(
      `AniList request failed: ${response.status}`
    );
  }

  const data = await response.json();

  if (data.errors?.length) {
    throw new Error(
      data.errors[0].message
    );
  }

  return data.data?.Character ?? null;
}