import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import {
  API_BASE_URL,
  GOOGLE_CLIENT_ID,
  getFrontendOrigin,
  logGoogleAuthConfig,
  maskConfigValue,
} from "./api";

function GoogleLoginButton({ onLoginSuccess }) {
  const handleSuccess = async (credentialResponse) => {
    logGoogleAuthConfig("Google credential received");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/google`,
        {
          token: credentialResponse.credential,
        }
      );

      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (onLoginSuccess) {
        onLoginSuccess(response.data.user);
      }
    } catch (error) {
      console.error("[AgriMind Auth] Backend Google login failed", {
        frontendOrigin: getFrontendOrigin(),
        googleClientId: maskConfigValue(GOOGLE_CLIENT_ID),
        apiBaseUrl: API_BASE_URL,
        status: error.response?.status,
        response: error.response?.data,
        message: error.message,
      });
      alert("Google login failed");
    }
  };

  const handleError = (errorResponse) => {
    console.error("[AgriMind Auth] Google OAuth response error", {
      frontendOrigin: getFrontendOrigin(),
      googleClientId: maskConfigValue(GOOGLE_CLIENT_ID),
      error: errorResponse,
    });

    alert("Google login failed");
  };

  const handleNonOAuthError = (errorResponse) => {
    console.error("[AgriMind Auth] Google non-OAuth response error", {
      frontendOrigin: getFrontendOrigin(),
      googleClientId: maskConfigValue(GOOGLE_CLIENT_ID),
      error: errorResponse,
    });
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
      onNonOAuthError={handleNonOAuthError}
      useOneTap={false}
    />
  );
}

export default GoogleLoginButton;
