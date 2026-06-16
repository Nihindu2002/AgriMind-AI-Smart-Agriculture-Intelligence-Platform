import os
import requests
from dotenv import load_dotenv

load_dotenv()

WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")

def get_current_weather(city: str):
    if not WEATHER_API_KEY:
        raise Exception("Weather API key not found")

    url = "http://api.weatherapi.com/v1/current.json"

    params = {
        "key": WEATHER_API_KEY,
        "q": city,
        "aqi": "no"
    }

    response = requests.get(url, params=params)

    if response.status_code != 200:
        raise Exception("Unable to fetch weather data")

    data = response.json()

    return {
        "city": data["location"]["name"],
        "country": data["location"]["country"],
        "temperature": data["current"]["temp_c"],
        "humidity": data["current"]["humidity"],
        "wind_speed": data["current"]["wind_kph"],
        "rainfall": data["current"]["precip_mm"],
        "condition": data["current"]["condition"]["text"]
    }