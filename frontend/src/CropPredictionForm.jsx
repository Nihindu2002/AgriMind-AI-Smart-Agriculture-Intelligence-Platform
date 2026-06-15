import { useState } from "react";
import axios from "axios";

function CropPredictionForm({ onPredictionSaved }) {
  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });

  const [result, setResult] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/predict-crop",
        formData
      );

      setResult(response.data.recommended_crop);

      if (onPredictionSaved) {
        onPredictionSaved();
      }
    } catch (error) {
      console.error("Prediction failed:", error);
    }
  };

  return (
    <div>
      <h2>Crop Recommendation</h2>

      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((field) => (
          <div key={field}>
            <input
              type="number"
              step="any"
              name={field}
              placeholder={field}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        <button type="submit">Predict Crop</button>
      </form>

      {result && (
        <h3>
          Recommended Crop: {result}
        </h3>
      )}
    </div>
  );
}

export default CropPredictionForm;