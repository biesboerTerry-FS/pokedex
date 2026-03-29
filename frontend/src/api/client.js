const TOKEN_KEY = 'pokedex_trainer_token';

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getApiBase() {
  return '/api/v1';
}

export async function apiFetch(path, options = {}) {
  const publicAuth =
    path.startsWith('/auth/login') || path.startsWith('/auth/register');
  const token = publicAuth ? null : getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${getApiBase()}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    const message =
      (data && data.message) || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

export function registerTrainer(payload) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function loginTrainer(payload) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function fetchTrainerMe() {
  return apiFetch('/auth/me');
}

export function togglePokemonCatch(pokemonId) {
  return apiFetch(`/pokemon/${pokemonId}/catch`, {
    method: 'PATCH',
    body: JSON.stringify({}),
  });
}
