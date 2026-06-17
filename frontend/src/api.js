const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const API_BASE_URL = apiUrl.replace(/\/+$/, "");

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

export function getFrontendOrigin() {
  if (typeof window === "undefined") {
    return "unknown";
  }

  return window.location.origin;
}

export function maskConfigValue(value) {
  if (!value) {
    return "missing";
  }

  if (value.length <= 12) {
    return `${value.slice(0, 2)}...${value.slice(-2)}`;
  }

  return `${value.slice(0, 8)}...${value.slice(-8)}`;
}

export function logGoogleAuthConfig(context = "Google auth config") {
  const frontendOrigin = getFrontendOrigin();
  const googleClientId = maskConfigValue(GOOGLE_CLIENT_ID);

  console.info(`[AgriMind Auth] ${context}`, {
    frontendOrigin,
    googleClientId,
  });

  console.info(
    `[AgriMind Auth] ${context}: origin=${frontendOrigin}, googleClientId=${googleClientId}`
  );
}
