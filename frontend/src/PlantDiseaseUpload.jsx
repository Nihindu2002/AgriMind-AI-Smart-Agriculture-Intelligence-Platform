import { useState } from "react";
import axios from "axios";
import { API_BASE_URL, getAuthHeaders } from "./api";

function UploadIcon() {
  return (
    <svg
      fill="none"
      height="42"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="42"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

function PlantDiseaseUpload({ onDiseaseSaved }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);

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

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      setResult(null);
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
      setErrorMessage("");

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${API_BASE_URL}/predict-disease`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...getAuthHeaders(),
          },
        }
      );

      setResult(response.data);

      if (onDiseaseSaved) {
        onDiseaseSaved();
      }
    } catch (error) {
      console.error("Disease prediction failed:", error);
      if (error.response?.status === 401) {
        setErrorMessage("Your session expired. Please log in again.");
      } else {
        setErrorMessage("Disease prediction failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const symptoms = result?.symptoms || [];
  const treatment = result?.treatment || [];
  const prevention = result?.prevention || [];

  return (
    <div>
      <h2>Plant Disease Detection</h2>
      <p>Upload a high-quality close-up leaf image to analyze symptoms and detect potential diseases using computer vision.</p>

      <form onSubmit={handleSubmit}>
        <div
          className={`upload-zone ${isDragActive ? "active" : ""}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input").click()}
          style={{ cursor: "pointer" }}
        >
          <UploadIcon />
          <span className="upload-zone-text">
            {file ? file.name : "Drag and drop leaf image here, or click to browse"}
          </span>
          <span className="upload-zone-hint">Supports JPEG, JPG, and PNG image files</span>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" disabled={loading || !file}>
          {loading ? "Analyzing Leaf Image..." : "Detect Disease Pattern"}
        </button>
      </form>

      {errorMessage && <p className="auth-error" style={{ marginTop: "12px" }}>{errorMessage}</p>}

      {preview && (
        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <span className="form-label" style={{ display: "block", marginBottom: "8px" }}>Selected Image Preview</span>
          <img
            src={preview}
            alt="Leaf preview"
            style={{
              width: "240px",
              height: "180px",
              objectFit: "cover",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              display: "inline-block",
            }}
          />
        </div>
      )}

      {result && (
        <div className="disease-history-card" style={{ marginTop: "20px", maxWidth: "500px", marginInline: "auto" }}>
          <div className="disease-title-block">
            Diagnosis: <span className="disease-label">{formatDiseaseName(result.disease)}</span>
          </div>
          <div className="disease-confidence">
            Analysis Confidence: <strong>{result.confidence}%</strong>
          </div>

          <div className="disease-details-section">
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
                <h4>Treatment Plan</h4>
                <ul>
                  {treatment.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </>
            )}

            {prevention.length > 0 && (
              <>
                <h4>Prevention Guidelines</h4>
                <ul>
                  {prevention.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PlantDiseaseUpload;
