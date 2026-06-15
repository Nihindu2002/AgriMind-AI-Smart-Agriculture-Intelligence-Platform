from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
from database import engine, SessionLocal
from models import Base, CropPrediction

app = FastAPI(title="AgriMind AI API")
Base.metadata.create_all(bind=engine)

model = joblib.load("crop_recommendation/crop_model.pkl")
label_encoder = joblib.load("crop_recommendation/label_encoder.pkl")

class CropInput(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

@app.post("/")
def home():
    return {"message": "AgriMind AI Crop Recommendation API is running."}

@app.post("/predict-crop")
def predict_crop(data: CropInput):
    input_data = pd.DataFrame([data.model_dump()])

    prediction = model.predict(input_data)[0]
    crop_name = label_encoder.inverse_transform([prediction])[0]

    db = SessionLocal()

    new_prediction = CropPrediction(
        N=data.N,
        P=data.P,
        K=data.K,
        temperature=data.temperature,
        humidity=data.humidity,
        ph=data.ph,
        rainfall=data.rainfall,
        recommended_crop=crop_name
    )

    db.add(new_prediction)
    db.commit()
    db.refresh(new_prediction)
    db.close()

    return {
        "id": new_prediction.id,
        "recommended_crop": crop_name
    }