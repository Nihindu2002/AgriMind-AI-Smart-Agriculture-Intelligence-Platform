import { useState } from "react";
import axios from "axios";

function CropPredictionForm() {
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

    const response = await axios.post(
      "http://127.0.0.1:8000/predict-crop",
      formData
    );

    setResult(response.data.recommended_crop);
  };

  return (
    <div>
      <h2>Crop Recommendation</h2>

      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((field) => (
          <input
            key={field}
            type="number"
            step="any"
            name={field}
            placeholder={field}
            onChange={handleChange}
            required
          />
        ))}

        <button type="submit">Predict Crop</button>
      </form>

      {result && <h3>Recommended Crop: {result}</h3>}
    </div>
  );
}

export default CropPredictionForm;