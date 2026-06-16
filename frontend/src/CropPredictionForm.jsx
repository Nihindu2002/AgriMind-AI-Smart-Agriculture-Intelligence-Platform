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
  const [errorMessage, setErrorMessage] = useState("");

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/predict-crop",
        formData,
        {
          headers: getAuthHeaders(),
        }
      );

      setResult(response.data.recommended_crop);

      if (onPredictionSaved) {
        onPredictionSaved();
      }
    } catch (error) {
      console.error("Prediction failed:", error);
      if (error.response?.status === 401) {
        setErrorMessage("Your session expired. Please log in again.");
      } else {
        setErrorMessage("Crop prediction failed. Please try again.");
      }
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

      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}

export default CropPredictionForm;
