import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  apiFetch,
  fetchTrainerMe,
  getStoredToken,
  loginTrainer,
  registerTrainer,
  setStoredToken,
} from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setStoredToken(null);
    setToken(null);
    setTrainer(null);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      const stored = getStoredToken();
      if (!stored) {
        if (!cancelled) {
          setTrainer(null);
          setLoading(false);
        }
        return;
      }

      setToken(stored);
      try {
        const me = await fetchTrainerMe();
        if (!cancelled) {
          setTrainer(me);
        }
      } catch {
        if (!cancelled) {
          setStoredToken(null);
          setToken(null);
          setTrainer(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const result = await loginTrainer({ email, password });
    setStoredToken(result.token);
    setToken(result.token);
    setTrainer(result.trainer);
    return result;
  }, []);

  const register = useCallback(
    async (email, password, displayName) => {
      const result = await registerTrainer({
        email,
        password,
        displayName,
      });
      setStoredToken(result.token);
      setToken(result.token);
      setTrainer(result.trainer);
      return result;
    },
    []
  );

  const value = useMemo(
    () => ({
      token,
      trainer,
      loading,
      isAuthenticated: Boolean(token && trainer),
      login,
      register,
      logout,
      apiFetch,
    }),
    [token, trainer, loading, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
