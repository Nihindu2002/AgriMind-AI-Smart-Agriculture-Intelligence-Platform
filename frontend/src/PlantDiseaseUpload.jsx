import { useState } from "react";
import axios from "axios";

function PlantDiseaseUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);

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
  };

  return (
    <div>
      <h2>Plant Disease Detection</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />

        <button type="submit">Detect Disease</button>
      </form>

      {preview && (
        <img
          src={preview}
          alt="Leaf preview"
          width="250"
        />
      )}

      {result && (
        <div>
          <h3>Disease: {result.disease}</h3>
          <p>Confidence: {result.confidence}%</p>
        </div>
      )}
    </div>
  );
}

export default PlantDiseaseUpload;