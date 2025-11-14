import Cookies from "js-cookie";

const AUTH_EVENT_KEY = "dnb:auth:change";
const AUTH_STORAGE_KEY = "dnb_auth_session";
const ACCESS_TOKEN_KEY = "authToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";

const isBrowser = typeof window !== "undefined";

const parseJSON = (value, fallback = null) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error("Failed to parse JSON value:", error);
    return fallback;
  }
};

const normaliseSession = (session = {}) => {
  if (!session) return null;
  const {
    accessToken = null,
    refreshToken = null,
    user = null,
    remember,
  } = session;

  if (!accessToken || !user) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
    user,
    remember: remember ?? true,
    updatedAt: Date.now(),
  };
};

const syncStorage = (storage, session) => {
  if (!storage) return;

  if (!session) {
    storage.removeItem(AUTH_STORAGE_KEY);
    storage.removeItem(ACCESS_TOKEN_KEY);
    storage.removeItem(REFRESH_TOKEN_KEY);
    storage.removeItem(USER_KEY);
    return;
  }

  try {
    storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    if (session.accessToken) {
      storage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
    } else {
      storage.removeItem(ACCESS_TOKEN_KEY);
    }

    if (session.refreshToken) {
      storage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
    } else {
      storage.removeItem(REFRESH_TOKEN_KEY);
    }

    if (session.user) {
      storage.setItem(USER_KEY, JSON.stringify(session.user));
    } else {
      storage.removeItem(USER_KEY);
    }
  } catch (error) {
    console.error("Failed to synchronise auth storage:", error);
  }
};

const emitSessionChange = (session) => {
  if (!isBrowser) return;
  window.dispatchEvent(
    new CustomEvent(AUTH_EVENT_KEY, {
      detail: session,
    })
  );
};

export const getUserFromCookie = () => {
  const userCookie = Cookies.get("userInfo");
  if (!userCookie) return null;
  try {
    return JSON.parse(userCookie);
  } catch (err) {
    console.error("Failed to parse user cookie:", err);
    return null;
  }
};

export const getStoredSession = () => {
  if (!isBrowser) return null;

  const sessionValue =
    sessionStorage.getItem(AUTH_STORAGE_KEY) ||
    localStorage.getItem(AUTH_STORAGE_KEY);

  const parsed = parseJSON(sessionValue);
  const normalised = normaliseSession(parsed);

  if (normalised && !sessionStorage.getItem(AUTH_STORAGE_KEY)) {
    // Hydrate session storage for compatibility with legacy lookups
    syncStorage(sessionStorage, normalised);
  }

  return normalised;
};

export const getSession = () => {
  const session = getStoredSession();
  return session?.user ?? null;
};

export const getAccessToken = () => {
  const session = getStoredSession();
  return session?.accessToken ?? null;
};

export const getRefreshToken = () => {
  const session = getStoredSession();
  return session?.refreshToken ?? null;
};

export const persistSession = (session, options = {}) => {
  if (!isBrowser) return null;

  if (!session) {
    clearSession();
    return null;
  }

  const normalised = normaliseSession({
    accessToken:
      session.accessToken ??
      session.token ??
      session.tokenPayload?.accessToken ??
      null,
    refreshToken: session.refreshToken ?? session?.data?.refreshToken ?? null,
    user: session.user ?? session.tokenPayload ?? session.data?.tokenPayload ?? null,
    remember:
      options.remember ??
      session.remember ??
      (session?.data?.remember !== undefined
        ? session.data.remember
        : undefined),
  });

  if (!normalised) {
    clearSession();
    return null;
  }

  syncStorage(sessionStorage, normalised);

  if (normalised.remember) {
    syncStorage(localStorage, normalised);
  } else {
    syncStorage(localStorage, null);
  }

  emitSessionChange(normalised);
  return normalised;
};

export const clearSession = () => {
  if (!isBrowser) return;
  syncStorage(sessionStorage, null);
  syncStorage(localStorage, null);
  emitSessionChange(null);
};

export const subscribeToSessionChanges = (callback) => {
  if (!isBrowser || typeof callback !== "function") return () => {};

  const handleCustomEvent = (event) => {
    callback(event.detail ?? getStoredSession());
  };

  const handleStorageEvent = (event) => {
    if (
      [AUTH_STORAGE_KEY, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY].includes(
        event.key
      )
    ) {
      callback(getStoredSession());
    }
  };

  window.addEventListener(AUTH_EVENT_KEY, handleCustomEvent);
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    window.removeEventListener(AUTH_EVENT_KEY, handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
  };
};

export const updateStoredUser = (updater) => {
  if (!isBrowser) return null;
  const current = getStoredSession();
  if (!current) return null;

  const nextUser =
    typeof updater === "function" ? updater(current.user ?? {}) : updater;

  const nextSession = {
    ...current,
    user: nextUser,
  };

  persistSession(nextSession, { remember: current.remember });
  return nextUser;
};
