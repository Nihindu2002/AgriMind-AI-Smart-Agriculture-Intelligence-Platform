import { useState } from "react";
import axios from "axios";

function WeatherAdvisory() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);

  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/weather-advisory/${city}`
      );

      setWeatherData(response.data);
    } catch (error) {
      console.error(error);
      alert("Unable to fetch weather data");
    }
  };

  return (
    <div style={{ marginTop: "30px" }}>
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
        <div>
          <h3>
            {weatherData.weather.city},{" "}
            {weatherData.weather.country}
          </h3>

          <p>Temperature: {weatherData.weather.temperature}°C</p>
          <p>Humidity: {weatherData.weather.humidity}%</p>
          <p>Rainfall: {weatherData.weather.rainfall} mm</p>
          <p>Wind Speed: {weatherData.weather.wind_speed} km/h</p>

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