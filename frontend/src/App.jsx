import { useState } from "react";
import GoogleLoginButton from "./GoogleLoginButton";
import CropPredictionForm from "./CropPredictionForm";
import CropHistory from "./CropHistory";
import PlantDiseaseUpload from "./PlantDiseaseUpload";
import DiseaseHistory from "./DiseaseHistory";
import WeatherAdvisory from "./WeatherAdvisory";

function App() {
  const [refreshHistory, setRefreshHistory] = useState(false);
  const [refreshDiseaseHistory, setRefreshDiseaseHistory] = useState(false);

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div>
      <h1>AgriMind AI</h1>

      {!user ? (
        <GoogleLoginButton onLoginSuccess={setUser} />
      ) : (
        <>
          <p>Logged in as {user.name}</p>
          <button onClick={handleLogout}>Logout</button>

          <CropPredictionForm
            onPredictionSaved={() => setRefreshHistory((prev) => !prev)}
          />

          <CropHistory refreshHistory={refreshHistory} />

          <PlantDiseaseUpload
            onDiseaseSaved={() =>
              setRefreshDiseaseHistory((prev) => !prev)
            }
          />

          <DiseaseHistory refreshDiseaseHistory={refreshDiseaseHistory} />

          <WeatherAdvisory />
        </>
      )}
    </div>
  );
}

export default App;