const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const configuredSessionMinutes = Number.parseInt(
  import.meta.env.VITE_SESSION_TIMEOUT_MINUTES || "15",
  10
);

export const API_BASE_URL = apiUrl.replace(/\/+$/, "");
export const SESSION_TIMEOUT_MS =
  Number.isFinite(configuredSessionMinutes) && configuredSessionMinutes > 0
    ? configuredSessionMinutes * 60 * 1000
    : 15 * 60 * 1000;

const TOKEN_STORAGE_KEY = "token";
const USER_STORAGE_KEY = "user";
const SESSION_EXPIRY_STORAGE_KEY = "sessionExpiresAt";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function refreshSessionExpiry(now = Date.now()) {
  if (!canUseStorage()) {
    return;
  }

  localStorage.setItem(
    SESSION_EXPIRY_STORAGE_KEY,
    String(now + SESSION_TIMEOUT_MS)
  );
}

export function clearAuthSession() {
  if (!canUseStorage()) {
    return;
  }

  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(SESSION_EXPIRY_STORAGE_KEY);
}

export function setStoredAuthSession(authData) {
  if (!canUseStorage()) {
    return authData.user;
  }

  localStorage.setItem(TOKEN_STORAGE_KEY, authData.access_token);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authData.user));
  refreshSessionExpiry();

  return authData.user;
}

export function getStoredSessionUser() {
  if (!canUseStorage()) {
    return null;
  }

  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);
  const sessionExpiresAt = Number.parseInt(
    localStorage.getItem(SESSION_EXPIRY_STORAGE_KEY) || "0",
    10
  );

  if (!token || !storedUser || !sessionExpiresAt || sessionExpiresAt <= Date.now()) {
    clearAuthSession();
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    clearAuthSession();
    return null;
  }
}

export function getAuthHeaders() {
  if (!canUseStorage()) {
    return {};
  }

  if (!getStoredSessionUser()) {
    return {};
  }

  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  return token ? { Authorization: `Bearer ${token}` } : {};
}
