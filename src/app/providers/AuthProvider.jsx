import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  clearSession,
  getStoredSession,
  persistSession,
  subscribeToSessionChanges,
} from "@/utils/auth";

const AuthContext = createContext({
  user: null,
  accessToken: null,
  refreshToken: null,
  remember: true,
  isAuthenticated: false,
  loading: true,
  login: () => {},
  logout: () => {},
  setSession: () => {},
  updateUser: () => {},
});

export function AuthProvider({ children }) {
  const [session, setSessionState] = useState(() => getStoredSession());
  const [initialised, setInitialised] = useState(Boolean(session));
  const initializingRef = useRef(false);

  useEffect(() => {
    if (initialised) return;
    if (initializingRef.current) return;

    initializingRef.current = true;
    const existing = getStoredSession();
    setSessionState(existing);
    setInitialised(true);
  }, [initialised]);

  useEffect(() => {
    const unsubscribe = subscribeToSessionChanges((nextSession) => {
      setSessionState(nextSession);
    });
    return unsubscribe;
  }, []);

  const setSession = useCallback((nextSession, options = {}) => {
    const persisted = persistSession(nextSession, options);
    setSessionState(persisted);
  }, []);

  const login = useCallback(
    (nextSession, options = {}) => {
      setSession(nextSession, options);
    },
    [setSession]
  );

  const logout = useCallback(() => {
    clearSession();
    setSessionState(null);
  }, []);

  const updateUser = useCallback((updater) => {
    setSessionState((prev) => {
      if (!prev) return prev;
      const nextUser =
        typeof updater === "function" ? updater(prev.user ?? {}) : updater;
      if (!nextUser) {
        return prev;
      }
      const nextSession = { ...prev, user: nextUser };
      persistSession(nextSession, { remember: prev.remember });
      return nextSession;
    });
  }, []);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      accessToken: session?.accessToken ?? null,
      refreshToken: session?.refreshToken ?? null,
      remember: session?.remember ?? true,
      isAuthenticated: Boolean(session?.accessToken && session?.user),
      loading: !initialised,
      login,
      logout,
      setSession,
      updateUser,
    }),
    [session, initialised, login, logout, setSession, updateUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
