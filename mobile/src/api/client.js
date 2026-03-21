const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getPokemonList() {
  return requestJson('/pokemon');
}

export function getPokemonById(id) {
  return requestJson(`/pokemon/${id}`);
}

export function createPokemon(payload) {
  return requestJson('/pokemon', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updatePokemon(id, payload) {
  return requestJson(`/pokemon/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deletePokemon(id) {
  return requestJson(`/pokemon/${id}`, { method: 'DELETE' });
}
