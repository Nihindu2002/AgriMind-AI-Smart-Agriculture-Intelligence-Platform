import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

function GoogleLoginButton({ onLoginSuccess }) {
  const handleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/google",
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