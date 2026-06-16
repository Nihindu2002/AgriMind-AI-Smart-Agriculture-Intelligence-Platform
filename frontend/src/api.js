const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const API_BASE_URL = apiUrl.replace(/\/+$/, "");

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
