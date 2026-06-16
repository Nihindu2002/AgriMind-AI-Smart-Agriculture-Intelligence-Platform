import { useEffect, useState } from "react";
import axios from "axios";

function DiseaseHistory({ refreshDiseaseHistory }) {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/disease-history");
      setHistory(response.data);
    } catch (error) {
      console.error("Error loading disease history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [refreshDiseaseHistory]);

  return (
    <div>
      <h2>Disease Prediction History</h2>

      {history.length === 0 ? (
        <p>No disease predictions found.</p>
      ) : (
        history.map((item) => (
          <div key={item.id}>
            <p>
              <strong>{item.disease}</strong> — {item.confidence}%
            </p>
            <p>File: {item.filename}</p>
            <p>{new Date(item.created_at).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default DiseaseHistory;