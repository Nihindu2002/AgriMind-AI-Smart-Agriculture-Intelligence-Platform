import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="1005651628591-omvjmbkftrhrff3imeiral7git07v6fe.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);