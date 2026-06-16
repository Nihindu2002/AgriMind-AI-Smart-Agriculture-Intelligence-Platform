from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime
from database import Base


class CropPrediction(Base):
    __tablename__ = "crop_predictions"

    id = Column(Integer, primary_key=True, index=True)
    N = Column(Float)
    P = Column(Float)
    K = Column(Float)
    temperature = Column(Float)
    humidity = Column(Float)
    ph = Column(Float)
    rainfall = Column(Float)
    recommended_crop = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


class DiseasePrediction(Base):
    __tablename__ = "disease_predictions"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    image_url = Column(String)
    disease = Column(String)
    confidence = Column(Float)

    symptoms = Column(String)
    treatment = Column(String)
    prevention = Column(String)

    created_at = Column(DateTime, default=datetime.utcnow)