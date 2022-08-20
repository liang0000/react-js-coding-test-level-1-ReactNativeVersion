const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export async function fetchPokemons() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon", {
    method: "GET",
    headers,
  });
  return response.json();
}

export async function fetchPokemonDetails(url) {
  const response = await fetch(url, {
    method: "GET",
    headers,
  });
  return response.json();
}
