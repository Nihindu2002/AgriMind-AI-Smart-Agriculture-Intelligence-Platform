import { useEffect, useState } from "react";
import axios from "axios";

function DiseaseHistory({ refreshDiseaseHistory }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDiseaseName = (disease) => {
    return disease.replace(/___/g, " - ").replace(/_/g, " ");
  };

  const fetchHistory = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://127.0.0.1:8000/disease-history"
      );

      setHistory(response.data);
    } catch (error) {
      console.error("Error loading disease history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [refreshDiseaseHistory]);

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Disease Prediction History</h2>

      {loading ? (
        <p>Loading...</p>
      ) : history.length === 0 ? (
        <p>No disease predictions found.</p>
      ) : (
        history.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #444",
              borderRadius: "12px",
              padding: "15px",
              marginBottom: "20px",
              maxWidth: "500px",
              margin: "20px auto",
              backgroundColor: "#111827",
            }}
          >
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.disease}
                style={{
                  width: "100%",
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  marginBottom: "15px",
                }}
              />
            )}

            <h3>
              Disease:{" "}
              <span style={{ color: "#ff6b6b" }}>
                {formatDiseaseName(item.disease)}
              </span>
            </h3>

            <p>
              <strong>Confidence:</strong> {item.confidence}%
            </p>

            <h4>Symptoms</h4>
            <ul>
              {item.symptoms.map((symptom, index) => (
                <li key={index}>{symptom}</li>
              ))}
            </ul>

            <h4>Treatment</h4>
            <ul>
              {item.treatment.map((treatment, index) => (
                <li key={index}>{treatment}</li>
              ))}
            </ul>

            <h4>Prevention</h4>
            <ul>
              {item.prevention.map((prevention, index) => (
                <li key={index}>{prevention}</li>
              ))}
            </ul>

            <p>
              <strong>Predicted At:</strong>{" "}
              {new Date(item.created_at).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default DiseaseHistory;