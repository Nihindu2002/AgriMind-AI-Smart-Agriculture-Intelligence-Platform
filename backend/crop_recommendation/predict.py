import joblib
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

model = joblib.load(BASE_DIR / "crop_model.pkl")
label_encoder = joblib.load(BASE_DIR / "label_encoder.pkl")

def predict_crop(N, P, K, temperature, humidity, ph, rainfall):
    input_data = pd.DataFrame([{
        "N": N,
        "P": P,
        "K": K,
        "temperature": temperature,
        "humidity": humidity,
        "ph": ph,
        "rainfall": rainfall
    }])

    prediction = model.predict(input_data)[0]
    crop_name = label_encoder.inverse_transform([prediction])[0]

    return crop_name

if __name__ == "__main__":
    N = 90
    P = 42
    K = 43
    temperature = 20.87
    humidity = 82.0
    ph = 6.5
    rainfall = 202.93

    recommended_crop = predict_crop(N, P, K, temperature, humidity, ph, rainfall)
    print("Recommended Crop:", recommended_crop)

