import { useState } from "react";
import CropPredictionForm from "./CropPredictionForm";
import CropHistory from "./CropHistory";
import PlantDiseaseUpload from "./PlantDiseaseUpload";
import DiseaseHistory from "./DiseaseHistory";

function App() {
  const [refreshHistory, setRefreshHistory] = useState(false);
  const [refreshDiseaseHistory, setRefreshDiseaseHistory] = useState(false);

  return (
    <div>
      <h1>AgriMind AI</h1>

      <CropPredictionForm
        onPredictionSaved={() => setRefreshHistory((prev) => !prev)}
      />

      <CropHistory refreshHistory={refreshHistory} />

      <PlantDiseaseUpload
        onDiseaseSaved={() => setRefreshDiseaseHistory((prev) => !prev)}
      />

      <DiseaseHistory refreshDiseaseHistory={refreshDiseaseHistory} />
    </div>
  );
}

export default App;