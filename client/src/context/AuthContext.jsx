import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';

/** @typedef {{ user: object|null, token: string|null, login: (email: string, password: string) => Promise<void>, logout: () => void }} AuthContextValue */

const AuthContext = createContext(/** @type {AuthContextValue} */ (null));

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('user', JSON.stringify({ email }));
    setToken(data.accessToken);
    setUser({ email });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** @returns {AuthContextValue} */
export const useAuth = () => useContext(AuthContext);
