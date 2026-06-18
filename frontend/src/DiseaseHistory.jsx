import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, getAuthHeaders } from "./api";

function DiseaseHistory({ refreshDiseaseHistory }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const formatDiseaseName = (disease) => {
    if (!disease) return "Unknown Disease";
    return disease.replace(/___/g, " - ").replace(/_/g, " ");
  };

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await axios.get(
        `${API_BASE_URL}/disease-history`,
        {
          headers: getAuthHeaders(),
        }
      );

      setHistory(response.data);
    } catch (error) {
      console.error("Error loading disease history:", error);
      if (error.response?.status === 401) {
        setErrorMessage("Your session expired. Please log in again.");
      } else {
        setErrorMessage("Unable to load disease history.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadHistoryTimer = window.setTimeout(fetchHistory, 0);
    return () => window.clearTimeout(loadHistoryTimer);
  }, [refreshDiseaseHistory]);

  return (
    <div>
      <h2>Disease History Log</h2>
      <p>Consult past leaf diagnostic predictions and corresponding treatment protocols.</p>

      {errorMessage && <p className="auth-error" style={{ marginBottom: "16px" }}>{errorMessage}</p>}

      {loading ? (
        <p>Loading disease scans...</p>
      ) : history.length === 0 ? (
        <p>No disease predictions found.</p>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <div key={item.id} className="disease-history-card">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.disease}
                  className="disease-image"
                />
              )}

              <div className="disease-title-block">
                Disease: <span className="disease-label">{formatDiseaseName(item.disease)}</span>
              </div>

              <div className="disease-confidence">
                Confidence: <strong>{item.confidence}%</strong>
              </div>

              <div className="disease-details-section">
                {item.symptoms && item.symptoms.length > 0 && (
                  <>
                    <h4>Symptoms</h4>
                    <ul>
                      {item.symptoms.map((symptom, index) => (
                        <li key={index}>{symptom}</li>
                      ))}
                    </ul>
                  </>
                )}

                {item.treatment && item.treatment.length > 0 && (
                  <>
                    <h4>Treatment</h4>
                    <ul>
                      {item.treatment.map((treatment, index) => (
                        <li key={index}>{treatment}</li>
                      ))}
                    </ul>
                  </>
                )}

                {item.prevention && item.prevention.length > 0 && (
                  <>
                    <h4>Prevention</h4>
                    <ul>
                      {item.prevention.map((prevention, index) => (
                        <li key={index}>{prevention}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "14px", marginBottom: 0 }}>
                Scanned At: {new Date(item.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DiseaseHistory;
