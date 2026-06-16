def generate_weather_recommendations(weather):
    recommendations = []

    temperature = weather["temperature"]
    humidity = weather["humidity"]
    rainfall = weather["rainfall"]
    wind_speed = weather["wind_speed"]

    if humidity > 80:
        recommendations.append("High humidity detected. There is a higher risk of fungal diseases.")

    if temperature > 32:
        recommendations.append("High temperature detected. Crops may need more irrigation.")

    if rainfall > 10:
        recommendations.append("Rainfall detected. Avoid unnecessary irrigation today.")

    if wind_speed > 25:
        recommendations.append("Strong wind detected. Avoid spraying pesticides or fertilizers.")

    if temperature >= 24 and temperature <= 30 and humidity < 80:
        recommendations.append("Weather conditions are generally suitable for crop growth.")

    if not recommendations:
        recommendations.append("Weather conditions are stable. Continue regular crop monitoring.")

    return recommendations