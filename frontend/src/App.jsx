import { useState } from "react";
import CropPredictionForm from "./CropPredictionForm";
import CropHistory from "./CropHistory";
import PlantDiseaseUpload from "./PlantDiseaseUpload";

function App() {
  const [refreshHistory, setRefreshHistory] = useState(false);

  return (
    <div>
      <h1>AgriMind AI</h1>

      <CropPredictionForm
        onPredictionSaved={() => setRefreshHistory((prev) => !prev)}
      />

      <CropHistory refreshHistory={refreshHistory} />

      <PlantDiseaseUpload />
    </div>
  );
}

export default App;