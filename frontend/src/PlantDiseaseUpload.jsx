import { useState } from "react";
import axios from "axios";

function PlantDiseaseUpload({ onDiseaseSaved }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const formatDiseaseName = (disease) => {
    if (!disease) return "Unknown Disease";
    return disease.replace(/___/g, " - ").replace(/_/g, " ");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setResult(null);

    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a leaf image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "http://127.0.0.1:8000/predict-disease",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);

      if (onDiseaseSaved) {
        onDiseaseSaved();
      }
    } catch (error) {
      console.error("Disease prediction failed:", error);
      alert("Disease prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const symptoms = result?.symptoms || [];
  const treatment = result?.treatment || [];
  const prevention = result?.prevention || [];

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Plant Disease Detection</h2>

      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <button type="submit" disabled={loading}>
          {loading ? "Detecting..." : "Detect Disease"}
        </button>
      </form>

      {preview && (
        <img
          src={preview}
          alt="Leaf preview"
          style={{
            width: "260px",
            marginTop: "15px",
            borderRadius: "10px",
          }}
        />
      )}

      {result && (
        <div
          style={{
            border: "1px solid #444",
            borderRadius: "12px",
            padding: "15px",
            margin: "20px auto",
            maxWidth: "500px",
          }}
        >
          <h3>Disease: {formatDiseaseName(result.disease)}</h3>
          <p>Confidence: {result.confidence}%</p>

          {symptoms.length > 0 && (
            <>
              <h4>Symptoms</h4>
              <ul>
                {symptoms.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}

          {treatment.length > 0 && (
            <>
              <h4>Treatment</h4>
              <ul>
                {treatment.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}

          {prevention.length > 0 && (
            <>
              <h4>Prevention</h4>
              <ul>
                {prevention.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default PlantDiseaseUpload;