import os
from pathlib import Path
import io
import json

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

from fastapi import Depends, FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel
from dotenv import load_dotenv
from jose import JWTError, jwt
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

import joblib
import pandas as pd
import tensorflow as tf
import numpy as np
from PIL import Image

from database import engine, SessionLocal
from models import Base, CropPrediction, DiseasePrediction, User

import tempfile
import cloudinary.uploader
import cloudinary_config

from weather.weather_service import get_current_weather
from weather.recommendations import generate_weather_recommendations


BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = "HS256"
security = HTTPBearer(auto_error=False)

# Plant disease model paths
plant_disease_dir = BASE_DIR / "plant_disease_detection" / "models"
disease_model_path = plant_disease_dir / "plant_disease_model.keras"
disease_class_names_path = plant_disease_dir / "class_names.json"

# Crop model paths
crop_model_path = BASE_DIR / "crop_recommendation" / "crop_model.pkl"
label_encoder_path = BASE_DIR / "crop_recommendation" / "label_encoder.pkl"

disease_info_path = BASE_DIR / "plant_disease_detection" / "disease_info.json"

if not disease_info_path.exists():
    raise FileNotFoundError(f"Disease info file not found at: {disease_info_path}")

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

with open(disease_info_path, "r") as f:
    disease_info = json.load(f)


class GoogleToken(BaseModel):
    token: str


def create_access_token(data: dict):
    if not JWT_SECRET_KEY:
        raise HTTPException(status_code=500, detail="JWT secret key is not configured")

    return jwt.encode(data, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Missing bearer token")

    if not JWT_SECRET_KEY:
        raise HTTPException(status_code=500, detail="JWT secret key is not configured")

    try:
        payload = jwt.decode(
            credentials.credentials,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM]
        )
        user_id = payload.get("user_id")

        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    db = SessionLocal()

    try:
        user = db.query(User).filter(User.id == user_id).first()

        if user is None:
            raise HTTPException(status_code=401, detail="User not found")

        return user

    finally:
        db.close()


@app.get("/")
def home():
    return {"message": "AgriMind AI API is running."}

@app.post("/predict-crop")
def predict_crop(
    data: CropInput,
    current_user: User = Depends(get_current_user)
):
    input_data = pd.DataFrame([data.model_dump()])

    prediction = crop_model.predict(input_data)[0]
    crop_name = label_encoder.inverse_transform([prediction])[0]

    db = SessionLocal()

    try:
        new_prediction = CropPrediction(
            user_id=current_user.id,
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
            "recommended_crop": crop_name
        }

    finally:
        db.close()


@app.get("/crop-history")
def get_crop_history(
    current_user: User = Depends(get_current_user)
):
    db = SessionLocal()

    try:
        history = db.query(CropPrediction).filter(
            CropPrediction.user_id == current_user.id
        ).order_by(CropPrediction.created_at.desc()).all()

        return history

    finally:
        db.close()

@app.delete("/crop-history/{prediction_id}")
def delete_crop_history(
    prediction_id: int,
    current_user: User = Depends(get_current_user)
):
    db = SessionLocal()

    try:
        prediction = db.query(CropPrediction).filter(
            CropPrediction.id == prediction_id,
            CropPrediction.user_id == current_user.id
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
def get_crop_stats(
    current_user: User = Depends(get_current_user)
):
    db = SessionLocal()

    try:
        total_predictions = db.query(CropPrediction).filter(
            CropPrediction.user_id == current_user.id
        ).count()

        latest_prediction = db.query(CropPrediction).filter(
            CropPrediction.user_id == current_user.id
        ).order_by(CropPrediction.created_at.desc()).first()

        return {
            "total_predictions": total_predictions,
            "latest_recommended_crop": latest_prediction.recommended_crop if latest_prediction else None,
        }

    finally:
        db.close()


@app.get("/disease-history")
def get_disease_history(
    current_user: User = Depends(get_current_user)
):
    db = SessionLocal()

    try:
        history = db.query(DiseasePrediction).filter(
            DiseasePrediction.user_id == current_user.id
        ).order_by(DiseasePrediction.created_at.desc()).all()

        result = []

        for item in history:
            result.append({
                "id": item.id,
                "image_url": item.image_url,
                "disease": item.disease,
                "confidence": item.confidence,
                "symptoms": json.loads(item.symptoms) if item.symptoms else [],
                "treatment": json.loads(item.treatment) if item.treatment else [],
                "prevention": json.loads(item.prevention) if item.prevention else [],
                "created_at": item.created_at
            })

        return result

    finally:
        db.close()


@app.get("/weather-advisory/{city}")
def weather_advisory(city: str):
    try:
        weather = get_current_weather(city)
        recommendations = generate_weather_recommendations(weather)

        return {
            "weather": weather,
            "recommendations": recommendations
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.post("/predict-disease")
async def predict_disease(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Please upload a valid image file")

    image_bytes = await file.read()

    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
        temp_file.write(image_bytes)
        temp_path = temp_file.name

    upload_result = cloudinary.uploader.upload(
        temp_path,
        folder="agrimind_disease_images"
    )

    image_url = upload_result["secure_url"]

    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((224, 224))

    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0)

    predictions = disease_model.predict(img_array)

    predicted_index = int(np.argmax(predictions[0]))
    confidence = float(predictions[0][predicted_index])
    disease_name = disease_class_names[predicted_index]

    info = disease_info.get(disease_name, {
        "symptoms": ["No symptom information available."],
        "treatment": ["No treatment information available."],
        "prevention": ["No prevention information available."]
    })

    db = SessionLocal()

    try:
        new_prediction = DiseasePrediction(
            user_id=current_user.id,
            filename=file.filename,
            image_url=image_url,
            disease=disease_name,
            confidence=round(confidence * 100, 2),
            symptoms=json.dumps(info["symptoms"]),
            treatment=json.dumps(info["treatment"]),
            prevention=json.dumps(info["prevention"])
        )

        db.add(new_prediction)
        db.commit()
        db.refresh(new_prediction)

        return {
            "id": new_prediction.id,
            "image_url": image_url,
            "disease": disease_name,
            "confidence": round(confidence * 100, 2),
            "symptoms": info["symptoms"],
            "treatment": info["treatment"],
            "prevention": info["prevention"]
        }

    finally:
        db.close()


@app.post("/auth/google")
def google_auth(data: GoogleToken):
    try:
        id_info = id_token.verify_oauth2_token(
            data.token,
            google_requests.Request(),
            GOOGLE_CLIENT_ID
        )

        google_id = id_info["sub"]
        email = id_info["email"]
        name = id_info.get("name")
        picture = id_info.get("picture")

        db = SessionLocal()

        try:
            user = db.query(User).filter(User.email == email).first()

            if not user:
                user = User(
                    google_id=google_id,
                    email=email,
                    name=name,
                    picture=picture
                )
                db.add(user)
                db.commit()
                db.refresh(user)

            access_token = create_access_token({
                "user_id": user.id,
                "email": user.email
            })

            return {
                "access_token": access_token,
                "token_type": "bearer",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "name": user.name,
                    "picture": user.picture
                }
            }

        finally:
            db.close()

    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
