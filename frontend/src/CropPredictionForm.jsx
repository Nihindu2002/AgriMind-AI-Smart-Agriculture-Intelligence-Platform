import { useState } from "react";
import axios from "axios";
import { API_BASE_URL, getAuthHeaders } from "./api";

function CheckIcon() {
  return (
    <svg
      className="crop-result-icon"
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/predict-crop`,
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
    } finally {
      setLoading(false);
    }
  };

  const fieldsConfig = [
    { name: "N", label: "Nitrogen (N)", placeholder: "e.g. 90", helper: "Soil nitrogen value (mg/kg)" },
    { name: "P", label: "Phosphorus (P)", placeholder: "e.g. 42", helper: "Soil phosphorus value (mg/kg)" },
    { name: "K", label: "Potassium (K)", placeholder: "e.g. 43", helper: "Soil potassium value (mg/kg)" },
    { name: "ph", label: "pH Level", placeholder: "e.g. 6.5", helper: "Soil acidity level (3.5 to 9.0)" },
    { name: "temperature", label: "Temperature (°C)", placeholder: "e.g. 25.6", helper: "Field air temperature in Celsius" },
    { name: "humidity", label: "Humidity (%)", placeholder: "e.g. 71.2", helper: "Relative air humidity percentage" },
    { name: "rainfall", label: "Rainfall (mm)", placeholder: "e.g. 102.4", helper: "Annual precipitations in millimeters" },
  ];

  return (
    <div>
      <h2>Crop Recommendation</h2>
      <p>Enter soil nutrient concentration and local weather parameters to predict the most suitable crop.</p>

      <form onSubmit={handleSubmit}>
        {fieldsConfig.map((field) => (
          <div key={field.name} className="form-group">
            <label htmlFor={field.name} className="form-label">
              {field.label}
            </label>
            <input
              id={field.name}
              type="number"
              step="any"
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleChange}
              required
            />
            <span className="form-helper">{field.helper}</span>
          </div>
        ))}

        <button type="submit" disabled={loading}>
          {loading ? "Analyzing Field Data..." : "Predict Suitable Crop"}
        </button>
      </form>

      {result && (
        <div className="crop-result-box">
          <CheckIcon />
          <div className="crop-result-text">
            <h3>Recommended Crop: {result}</h3>
            <p>Based on NPK ratios, soil pH, and climate parameters, {result} is predicted to yield the best harvest.</p>
          </div>
        </div>
      )}

      {errorMessage && <p className="auth-error" style={{ marginTop: "12px" }}>{errorMessage}</p>}
    </div>
  );
}

export default CropPredictionForm;
