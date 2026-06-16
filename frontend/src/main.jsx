import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import { GOOGLE_CLIENT_ID, logGoogleAuthConfig } from "./api";

logGoogleAuthConfig("GoogleOAuthProvider initialized");

if (!GOOGLE_CLIENT_ID) {
  console.error(
    "[AgriMind Auth] Missing VITE_GOOGLE_CLIENT_ID. Google login will not work."
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
