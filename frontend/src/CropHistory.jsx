import { useEffect, useState } from "react";
import axios from "axios";

function CropHistory({ refreshHistory }) {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/crop-history"
      );

      setHistory(response.data);
    } catch (error) {
      console.error("Error loading history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [refreshHistory]);

  return (
    <div>
      <h2>Prediction History</h2>

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
          </div>
        ))
      )}
    </div>
  );
}

export default CropHistory;