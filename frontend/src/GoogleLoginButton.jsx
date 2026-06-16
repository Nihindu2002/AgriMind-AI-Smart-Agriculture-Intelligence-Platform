import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { API_BASE_URL } from "./api";

function GoogleLoginButton({ onLoginSuccess }) {
  const handleSuccess = async (credentialResponse) => {
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
      console.error("Google login failed:", error);
      alert("Google login failed");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => alert("Google login failed")}
    />
  );
}

export default GoogleLoginButton;
