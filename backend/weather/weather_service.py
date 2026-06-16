import os

import requests
from dotenv import load_dotenv

load_dotenv()

WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")
WEATHER_API_URL = "http://api.weatherapi.com/v1/current.json"


class WeatherServiceError(Exception):
    """Raised when WeatherAPI.com cannot return usable weather data."""


def _validate_api_key():
    if not WEATHER_API_KEY:
        raise WeatherServiceError("Weather API key not found")


def _format_weather_response(data):
    try:
        return {
            "city": data["location"]["name"],
            "country": data["location"]["country"],
            "temperature": data["current"]["temp_c"],
            "humidity": data["current"]["humidity"],
            "wind_speed": data["current"]["wind_kph"],
            "rainfall": data["current"]["precip_mm"],
            "condition": data["current"]["condition"]["text"],
        }
    except KeyError as exc:
        raise WeatherServiceError(
            "Weather API returned an unexpected response"
        ) from exc


def _fetch_current_weather(query: str):
    _validate_api_key()

    if not query or not str(query).strip():
        raise ValueError("Weather location query is required")

    params = {
        "key": WEATHER_API_KEY,
        "q": str(query).strip(),
        "aqi": "no",
    }

    try:
        response = requests.get(WEATHER_API_URL, params=params, timeout=10)
    except requests.RequestException as exc:
        raise WeatherServiceError("Weather API request failed") from exc

    if response.status_code != 200:
        message = "Unable to fetch weather data"

        try:
            error_message = response.json().get("error", {}).get("message")
            if error_message:
                message = error_message
        except ValueError:
            pass

        raise WeatherServiceError(message)

    return _format_weather_response(response.json())


def _validate_coordinates(lat, lon):
    if lat is None or lon is None:
        raise ValueError("Latitude and longitude are required")

    try:
        latitude = float(lat)
        longitude = float(lon)
    except (TypeError, ValueError) as exc:
        raise ValueError("Latitude and longitude must be valid numbers") from exc

    if latitude < -90 or latitude > 90:
        raise ValueError("Latitude must be between -90 and 90")

    if longitude < -180 or longitude > 180:
        raise ValueError("Longitude must be between -180 and 180")

    return latitude, longitude


def get_current_weather(city: str):
    return _fetch_current_weather(city)


def get_current_weather_by_location(lat, lon):
    latitude, longitude = _validate_coordinates(lat, lon)
    return _fetch_current_weather(f"{latitude},{longitude}")
