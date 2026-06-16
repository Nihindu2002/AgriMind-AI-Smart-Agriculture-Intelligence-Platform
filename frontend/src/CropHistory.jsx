import { useEffect, useState } from "react";
import axios from "axios";

function CropHistory({ refreshHistory }) {
  const [history, setHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchHistory = async () => {
    try {
      setErrorMessage("");

      const response = await axios.get(
        "http://127.0.0.1:8000/crop-history",
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
    }
  };

  const deletePrediction = async (predictionId) => {
    try {
      setErrorMessage("");

      await axios.delete(
        `http://127.0.0.1:8000/crop-history/${predictionId}`,
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
    fetchHistory();
  }, [refreshHistory]);

  return (
    <div>
      <h2>Prediction History</h2>

      {errorMessage && <p>{errorMessage}</p>}

      {history.length === 0 ? (
        <p>No predictions found.</p>
      ) : (
        history.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <p>
              <strong>Crop:</strong>{" "}
              {item.recommended_crop}
            </p>

            <p>
              N: {item.N} | P: {item.P} | K: {item.K}
            </p>

            <p>
              Temp: {item.temperature}°C | Humidity:{" "}
              {item.humidity}%
            </p>

            <p>
              pH: {item.ph} | Rainfall:{" "}
              {item.rainfall}
            </p>

            <p>
              Created:{" "}
              {new Date(item.created_at).toLocaleString()}
            </p>

            <button onClick={() => deletePrediction(item.id)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default CropHistory;
