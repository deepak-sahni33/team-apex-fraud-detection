// src/store/authContext.jsx
// Authentication state architecture — prepared for Phase 2.
// Phase 1: provides no-op stubs. Replace with real auth logic later.

import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Phase 2: replace with real user object from JWT / session
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(false);

  /** Phase 2: call POST /auth/login */
  const login = useCallback(async (/* credentials */) => {
    setLoading(true);
    try {
      // Phase 2: const data = await api.post('/auth/login', credentials);
      // setUser(data.user);
    } finally {
      setLoading(false);
    }
  }, []);

  /** Phase 2: call POST /auth/logout */
  const logout = useCallback(async () => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
