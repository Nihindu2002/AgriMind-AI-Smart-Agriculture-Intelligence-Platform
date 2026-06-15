import { useEffect, useState } from "react";
import axios from "axios";

function CropHistory() {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    const response = await axios.get("http://127.0.0.1:8000/crop-history");
    setHistory(response.data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div>
      <h2>Prediction History</h2>

      {history.map((item) => (
        <div key={item.id}>
          <p>
            <b>{item.recommended_crop}</b> — N:{item.N}, P:{item.P}, K:{item.K}
          </p>
        </div>
      ))}
    </div>
  );
}

export default CropHistory;