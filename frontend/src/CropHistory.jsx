import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, getAuthHeaders } from "./api";

function CropHistory({ refreshHistory }) {
  const [history, setHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      setErrorMessage("");
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/crop-history`,
        {
          headers: getAuthHeaders(),
        }
      );
      setHistory(response.data);
    } catch (error) {
      console.error("Error loading history:", error);
      if (error.response?.status === 401) {
        setErrorMessage("Your session expired. Please log in again.");
      } else {
        setErrorMessage("Unable to load crop history.");
      }
    } finally {
      setLoading(false);
    }
  };

  const deletePrediction = async (predictionId) => {
    try {
      setErrorMessage("");
      await axios.delete(
        `${API_BASE_URL}/crop-history/${predictionId}`,
        {
          headers: getAuthHeaders(),
        }
      );
      setHistory((currentHistory) =>
        currentHistory.filter((item) => item.id !== predictionId)
      );
    } catch (error) {
      console.error("Error deleting prediction:", error);
      if (error.response?.status === 401) {
        setErrorMessage("Your session expired. Please log in again.");
      } else {
        setErrorMessage("Unable to delete this crop prediction.");
      }
    }
  };

  useEffect(() => {
    const loadHistoryTimer = window.setTimeout(fetchHistory, 0);
    return () => window.clearTimeout(loadHistoryTimer);
  }, [refreshHistory]);

  return (
    <div>
      <h2>Prediction History</h2>
      <p>Review and manage previous crop recommendation prediction entries saved on your profile.</p>

      {errorMessage && <p className="auth-error" style={{ marginBottom: "16px" }}>{errorMessage}</p>}

      {loading && history.length === 0 ? (
        <p>Loading prediction records...</p>
      ) : history.length === 0 ? (
        <p>No predictions found.</p>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <div key={item.id} className="history-item">
              <div className="history-header">
                <span className="history-title">Recommended Crop: {item.recommended_crop}</span>
                <span className="history-date">
                  {new Date(item.created_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="history-grid-info">
                <div className="history-data-pill">
                  N: <span>{item.N}</span> | P: <span>{item.P}</span> | K: <span>{item.K}</span>
                </div>
                <div className="history-data-pill">
                  Soil pH: <span>{item.ph}</span>
                </div>
                <div className="history-data-pill">
                  Temp: <span>{item.temperature}°C</span>
                </div>
                <div className="history-data-pill">
                  Humidity: <span>{item.humidity}%</span>
                </div>
                <div className="history-data-pill" style={{ gridColumn: "1 / -1" }}>
                  Rainfall: <span>{item.rainfall} mm</span>
                </div>
              </div>

              <div className="history-actions">
                <button
                  className="btn btn-danger btn-small"
                  onClick={() => deletePrediction(item.id)}
                  type="button"
                >
                  Delete Record
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CropHistory;
