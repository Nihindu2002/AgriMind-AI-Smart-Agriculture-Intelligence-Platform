import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "./api";

function getApiErrorMessage(error, fallbackMessage) {
  return error.response?.data?.detail || fallbackMessage;
}

function LocationIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="18"
      viewBox="0 0 24 24"
      width="18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function WeatherAdvisory() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const isLoading = Boolean(loadingMessage);

  const fetchWeatherByCity = async () => {
    const trimmedCity = city.trim();

    if (!trimmedCity) {
      setErrorMessage("Please enter a city or use your current location.");
      return;
    }

    try {
      setErrorMessage("");
      setLoadingMessage("Fetching weather...");

      const response = await axios.get(
        `${API_BASE_URL}/weather-advisory/${encodeURIComponent(trimmedCity)}`
      );

      setWeatherData(response.data);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        getApiErrorMessage(error, "Unable to fetch weather data.")
      );
    } finally {
      setLoadingMessage("");
    }
  };

  const fetchWeatherByLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage(
        "Location detection is not supported by this browser. Please enter city manually."
      );
      return;
    }

    setErrorMessage("");
    setLoadingMessage("Detecting location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          setLoadingMessage("Fetching weather...");

          const response = await axios.get(
            `${API_BASE_URL}/weather-advisory-location`,
            {
              params: {
                lat: latitude,
                lon: longitude,
              },
            }
          );

          setWeatherData(response.data);
        } catch (error) {
          console.error(error);
          setErrorMessage(
            getApiErrorMessage(error, "Unable to fetch weather for your location.")
          );
        } finally {
          setLoadingMessage("");
        }
      },
      (error) => {
        console.error(error);
        setLoadingMessage("");

        if (error.code === error.PERMISSION_DENIED || error.code === 1) {
          setErrorMessage(
            "Location access denied. Please enter city manually."
          );
          return;
        }

        setErrorMessage(
          "Unable to detect your location. Please enter city manually."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  const weather = weatherData?.weather;
  const recommendations = weatherData?.recommendations || [];

  return (
    <div className="weather-advisory">
      <div className="weather-header">
        <div>
          <h2>Weather Advisory</h2>
          <p>
            Search by city or detect your location for farming recommendations.
          </p>
        </div>
      </div>

      <div className="weather-search-panel">
        <div className="weather-input-group">
          <input
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchWeatherByCity();
              }
            }}
          />

          <button onClick={fetchWeatherByCity} disabled={isLoading}>
            Check Weather
          </button>
        </div>

        <button
          className="location-button"
          onClick={fetchWeatherByLocation}
          disabled={isLoading}
          title="Use my current location"
          type="button"
        >
          <LocationIcon />
          <span>Use My Location</span>
        </button>
      </div>

      {loadingMessage && (
        <p className="weather-status">{loadingMessage}</p>
      )}

      {errorMessage && (
        <p className="weather-error">{errorMessage}</p>
      )}

      {weather && (
        <div className="weather-results">
          <div className="weather-summary">
            <div>
              <span>Current location</span>
              <h3>
                {weather.city}, {weather.country}
              </h3>
            </div>
            <strong>{weather.temperature}°C</strong>
          </div>

          <div className="weather-metrics">
            <div>
              <span>Condition</span>
              <strong>{weather.condition}</strong>
            </div>
            <div>
              <span>Humidity</span>
              <strong>{weather.humidity}%</strong>
            </div>
            <div>
              <span>Rainfall</span>
              <strong>{weather.rainfall} mm</strong>
            </div>
            <div>
              <span>Wind Speed</span>
              <strong>{weather.wind_speed} km/h</strong>
            </div>
          </div>

          <div className="weather-recommendations">
            <h3>Farming Recommendations</h3>
            <ul>
              {recommendations.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherAdvisory;
