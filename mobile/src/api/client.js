import Constants from 'expo-constants';

function normalizeBaseUrl(value) {
  return String(value || '').replace(/\/+$/, '');
}

function getDevMachineHost() {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.expoGoConfig?.debuggerHost ||
    Constants.manifest2?.extra?.expoClient?.hostUri ||
    '';

  if (!hostUri) {
    return '';
  }

  return hostUri.split(':')[0];
}

export function getApiBaseUrl() {
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return normalizeBaseUrl(process.env.EXPO_PUBLIC_API_BASE_URL);
  }

  const host = getDevMachineHost();
  if (host) {
    return `http://${host}:8000/api/v1`;
  }

  return 'http://localhost:8000/api/v1';
}

const API_BASE_URL = getApiBaseUrl();

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
