import os
from pathlib import Path
import io
import json

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import joblib
import pandas as pd
import tensorflow as tf
import numpy as np
from PIL import Image

from database import engine, SessionLocal
from models import Base, CropPrediction, DiseasePrediction

import tempfile
import cloudinary.uploader
import cloudinary_config


BASE_DIR = Path(__file__).resolve().parent

# Plant disease model paths
plant_disease_dir = BASE_DIR / "plant_disease_detection" / "models"
disease_model_path = plant_disease_dir / "plant_disease_model.keras"
disease_class_names_path = plant_disease_dir / "class_names.json"

# Crop model paths
crop_model_path = BASE_DIR / "crop_recommendation" / "crop_model.pkl"
label_encoder_path = BASE_DIR / "crop_recommendation" / "label_encoder.pkl"


if not disease_model_path.exists():
    raise FileNotFoundError(f"Disease model not found at: {disease_model_path}")

if not disease_class_names_path.exists():
    raise FileNotFoundError(f"Disease class names file not found at: {disease_class_names_path}")

if not crop_model_path.exists():
    raise FileNotFoundError(f"Crop model not found at: {crop_model_path}")

if not label_encoder_path.exists():
    raise FileNotFoundError(f"Label encoder not found at: {label_encoder_path}")


# Load models
disease_model = tf.keras.models.load_model(str(disease_model_path))

with open(disease_class_names_path, "r") as f:
    disease_class_names = json.load(f)

crop_model = joblib.load(str(crop_model_path))
label_encoder = joblib.load(str(label_encoder_path))


app = FastAPI(title="AgriMind AI API")

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CropInput(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float


@app.get("/")
def home():
    return {"message": "AgriMind AI API is running."}


@app.post("/predict-crop")
def predict_crop(data: CropInput):
    input_data = pd.DataFrame([data.model_dump()])

    prediction = crop_model.predict(input_data)[0]
    crop_name = label_encoder.inverse_transform([prediction])[0]

    db = SessionLocal()

    try:
        new_prediction = CropPrediction(
            N=data.N,
            P=data.P,
            K=data.K,
            temperature=data.temperature,
            humidity=data.humidity,
            ph=data.ph,
            rainfall=data.rainfall,
            recommended_crop=crop_name,
        )

        db.add(new_prediction)
        db.commit()
        db.refresh(new_prediction)

        return {
            "id": new_prediction.id,
            "recommended_crop": crop_name,
        }

    finally:
        db.close()


@app.get("/crop-history")
def get_crop_history():
    db = SessionLocal()

    try:
        history = db.query(CropPrediction).order_by(
            CropPrediction.created_at.desc()
        ).all()

        return history

    finally:
        db.close()


@app.delete("/crop-history/{prediction_id}")
def delete_crop_history(prediction_id: int):
    db = SessionLocal()

    try:
        prediction = db.query(CropPrediction).filter(
            CropPrediction.id == prediction_id
        ).first()

        if prediction is None:
            raise HTTPException(status_code=404, detail="Prediction not found")

        db.delete(prediction)
        db.commit()

        return {
            "message": "Prediction deleted successfully",
            "deleted_id": prediction_id,
        }

    finally:
        db.close()


@app.get("/crop-stats")
def get_crop_stats():
    db = SessionLocal()

    try:
        total_predictions = db.query(CropPrediction).count()

        latest_prediction = db.query(CropPrediction).order_by(
            CropPrediction.created_at.desc()
        ).first()

        return {
            "total_predictions": total_predictions,
            "latest_recommended_crop": latest_prediction.recommended_crop if latest_prediction else None,
        }

    finally:
        db.close()


@app.post("/predict-disease")
async def predict_disease(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a valid image file"
        )

    image_bytes = await file.read()

    # Upload image to Cloudinary
    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".jpg"
    ) as temp_file:
        temp_file.write(image_bytes)
        temp_path = temp_file.name

    upload_result = cloudinary.uploader.upload(
        temp_path,
        folder="agrimind_disease_images"
    )

    image_url = upload_result["secure_url"]

    # Process image for prediction
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((224, 224))

    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0)

    predictions = disease_model.predict(img_array)

    predicted_index = int(np.argmax(predictions[0]))
    confidence = float(predictions[0][predicted_index])

    disease_name = disease_class_names[predicted_index]

    db = SessionLocal()

    try:
        new_prediction = DiseasePrediction(
            filename=file.filename,
            image_url=image_url,
            disease=disease_name,
            confidence=round(confidence * 100, 2)
        )

        db.add(new_prediction)
        db.commit()
        db.refresh(new_prediction)

        return {
            "id": new_prediction.id,
            "image_url": image_url,
            "filename": file.filename,
            "disease": disease_name,
            "confidence": round(confidence * 100, 2)
        }

    finally:
        db.close()

@app.get("/disease-history")
def get_disease_history():
    db = SessionLocal()

    try:
        history = db.query(DiseasePrediction).order_by(
            DiseasePrediction.created_at.desc()
        ).all()

        return history

    finally:
        db.close()