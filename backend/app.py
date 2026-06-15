from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
from database import engine, SessionLocal
from models import Base, CropPrediction
from fastapi import HTTPException

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
@app.get("/crop-history")
def get_crop_history():
    db = SessionLocal()

    history = db.query(CropPrediction).order_by(
        CropPrediction.created_at.desc()
    ).all()

    db.close()

    return history

@app.delete("/crop-history/{prediction_id}")
def delete_crop_history(prediction_id: int):
    db = SessionLocal()

    prediction = db.query(CropPrediction).filter(
        CropPrediction.id == prediction_id
    ).first()

    if prediction is None:
        db.close()
        raise HTTPException(status_code=404, detail="Prediction not found")

    db.delete(prediction)
    db.commit()
    db.close()

    return {
        "message": "Prediction deleted successfully",
        "deleted_id": prediction_id
    }

@app.get("/crop-stats")
def get_crop_stats():
    db = SessionLocal()

    total_predictions = db.query(CropPrediction).count()

    latest_prediction = db.query(CropPrediction).order_by(
        CropPrediction.created_at.desc()
    ).first()

    db.close()

    return {
        "total_predictions": total_predictions,
        "latest_recommended_crop": latest_prediction.recommended_crop if latest_prediction else None
    }