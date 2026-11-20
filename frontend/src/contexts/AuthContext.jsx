import { createContext, useContext, useState } from 'react';
import { authApi } from '../services/authApi';

const AuthContext = createContext(null);
const STORAGE_KEY = 'messenger-session';

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadSession);

  function startSession({ user, token }) {
    const newSession = { user, token };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
    setSession(newSession);
  }

  const value = {
    session,
    startSession,
    async login(username, password) {
      startSession(await authApi.login(username, password));
    },
    register: (username, password, inviteCode) => authApi.register(username, password, inviteCode),
    recover: (username, code, newPassword) => authApi.recover(username, code, newPassword),
    logout() {
      localStorage.removeItem(STORAGE_KEY);
      setSession(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);