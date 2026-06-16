import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "./api";

function WeatherAdvisory() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);

  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/weather-advisory/${city}`
      );

      setWeatherData(response.data);
    } catch (error) {
      console.error(error);
      alert("Unable to fetch weather data");
    }
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Weather Advisory</h2>

      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <button onClick={fetchWeather}>
        Check Weather
      </button>

      {weatherData && (
        <div
          style={{
            marginTop: "20px",
            border: "1px solid #444",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>
            {weatherData.weather.city},{" "}
            {weatherData.weather.country}
          </h3>

          <p>
            🌡 Temperature: {weatherData.weather.temperature}°C
          </p>

          <p>
            💧 Humidity: {weatherData.weather.humidity}%
          </p>

          <p>
            🌧 Rainfall: {weatherData.weather.rainfall} mm
          </p>

          <p>
            💨 Wind Speed: {weatherData.weather.wind_speed} km/h
          </p>

          <p>
            ☁ Condition: {weatherData.weather.condition}
          </p>

          <h4>Recommendations</h4>

          <ul>
            {weatherData.recommendations.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default WeatherAdvisory;
