# 🌾 AgriMind AI - Smart Agriculture Intelligence Platform

An intelligent agricultural platform powered by AI and machine learning that helps farmers make data-driven decisions for crop selection, plant disease detection, and weather-based recommendations.

**Live Demo:** [https://agri-mind-ai-smart-agriculture-inte.vercel.app](https://agri-mind-ai-smart-agriculture-inte.vercel.app)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Usage Guide](#usage-guide)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### 🌱 **Crop Recommendation**
- AI-powered crop prediction based on soil and environmental parameters
- Considers nitrogen (N), phosphorus (P), potassium (K) levels
- Analyzes temperature, humidity, pH, and rainfall
- Maintains prediction history for farmers

### 🔍 **Plant Disease Detection**
- Deep learning model for identifying plant diseases from images
- Uses TensorFlow/Keras for image classification
- Provides detailed disease information including:
  - Symptoms
  - Treatment recommendations
  - Prevention strategies
- Image storage via Cloudinary
- Disease history tracking

### 🌤️ **Weather Advisory**
- Real-time weather data retrieval by city or GPS coordinates
- AI-generated recommendations based on current weather conditions
- Helps farmers plan agricultural activities

### 👤 **User Authentication**
- Secure JWT-based authentication
- User account management with email verification
- PBKDF2 password hashing for security
- Role-based access to predictions and history

### 📊 **User Dashboard**
- View prediction history
- Track crop recommendations
- Monitor disease detections
- Statistics and insights

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19.2.6
- **Build Tool:** Vite 8.0.12
- **Routing:** React Router DOM 7.17.0
- **HTTP Client:** Axios 1.18.0
- **Styling:** CSS3
- **Linting:** ESLint

### Backend
- **Framework:** FastAPI
- **Language:** Python 3.x
- **Database:** PostgreSQL with SQLAlchemy ORM
- **Authentication:** JWT with PyJWT
- **ML/AI:** TensorFlow, Keras, Scikit-learn, Pandas, NumPy
- **Image Processing:** Pillow
- **Image Storage:** Cloudinary
- **Weather API:** Integration for real-time data
- **Web Server:** Uvicorn (ASGI)

### Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** PostgreSQL
- **Image Storage:** Cloudinary

---

## 📁 Project Structure

```
AgriMind-AI-Smart-Agriculture-Intelligence-Platform/
├── frontend/                           # React frontend application
│   ├── src/                           # React components and logic
│   ├── public/                        # Static assets
│   ├── package.json                   # Frontend dependencies
│   ├── vite.config.js                 # Vite configuration
│   ├── index.html                     # HTML entry point
│   └── vercel.json                    # Vercel deployment config
│
├── backend/                            # FastAPI backend application
│   ├── app.py                         # Main FastAPI application
│   ├── database.py                    # Database configuration
│   ├── models.py                      # SQLAlchemy ORM models
│   ├── cloudinary_config.py           # Cloudinary setup
│   ├── requirements.txt               # Python dependencies
│   ├── .env.example                   # Environment variables template
│   │
│   ├── crop_recommendation/           # Crop prediction module
│   │   ├── crop_model.pkl            # Pre-trained ML model
│   │   └── label_encoder.pkl         # Label encoding utility
│   │
│   ├── plant_disease_detection/      # Disease detection module
│   │   ├── models/                   # Keras deep learning models
│   │   │   ├── plant_disease_model.keras
│   │   │   ├── class_names.json
│   │   │   └── disease_info.json
│   │   └── ...
│   │
│   └── weather/                      # Weather advisory module
│       ├── weather_service.py        # Weather API integration
│       └── recommendations.py        # AI-generated recommendations
│
├── app.py                             # Application entry point
├── requirements.txt                   # Root requirements file
├── render.yaml                        # Render deployment config
├── runtime.txt                        # Python runtime version
└── .gitignore                         # Git ignore file
```

---

## 📋 Prerequisites

- **Python 3.10+** (Backend)
- **Node.js 18+** and **npm** (Frontend)
- **PostgreSQL 12+** (Database)
- **Git** (Version control)
- **Cloudinary Account** (Image storage)
- **API Keys:**
  - OpenWeatherMap API (for weather data)
  - JWT Secret Key

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Nihindu2002/AgriMind-AI-Smart-Agriculture-Intelligence-Platform.git
cd AgriMind-AI-Smart-Agriculture-Intelligence-Platform
```

### 2. Set Up Backend

Navigate to the backend directory:

```bash
cd backend
```

#### Create Virtual Environment

```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

#### Install Dependencies

```bash
pip install -r requirements.txt
```

#### Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration (see [Environment Variables](#environment-variables) section).

#### Initialize Database

```bash
python -c "from database import Base, engine; Base.metadata.create_all(bind=engine)"
```

#### Run Backend Server

```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`

### 3. Set Up Frontend

Navigate to the frontend directory:

```bash
cd frontend
```

#### Install Dependencies

```bash
npm install
```

#### Configure Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```bash
cp .env.example .env.local
```

```env
VITE_API_BASE_URL=http://localhost:8000
```

#### Run Development Server

```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173`

---

## 🔧 Backend Setup

### Database Configuration

The backend uses PostgreSQL. Update your `.env` file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/agrimind_db
```

### Models & ML Components

- **Crop Model:** `crop_recommendation/crop_model.pkl` - Pre-trained RandomForest/XGBoost model
- **Disease Model:** `plant_disease_detection/models/plant_disease_model.keras` - Deep learning CNN model
- **Class Names:** `plant_disease_detection/models/class_names.json` - Disease class mappings

### Key Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| `POST` | `/auth/signup` | Register new user | ❌ |
| `POST` | `/auth/login` | User login | ❌ |
| `POST` | `/predict-crop` | Get crop recommendation | ✅ |
| `GET` | `/crop-history` | View crop predictions | ✅ |
| `DELETE` | `/crop-history/{id}` | Delete prediction | ✅ |
| `GET` | `/crop-stats` | Get crop statistics | ✅ |
| `POST` | `/predict-disease` | Detect plant disease | ✅ |
| `GET` | `/disease-history` | View disease detections | ✅ |
| `GET` | `/weather-advisory/{city}` | Get weather advisory | ✅ |
| `GET` | `/weather-advisory-location` | Weather by coordinates | ✅ |

---

## 🔐 Environment Variables

### Backend (`.env`)

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/agrimind_db

# JWT Configuration
JWT_SECRET_KEY=your_secret_key_here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480
PASSWORD_HASH_ITERATIONS=260000

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Weather API Configuration
WEATHER_API_KEY=your_openweathermap_api_key

# CORS Configuration
FRONTEND_ORIGINS=http://localhost:5173,https://yourdomain.vercel.app
FRONTEND_ORIGIN_REGEX=https://agri-mind-ai-smart-agriculture-intelligence-platform-[a-z0-9]+\.vercel\.app

# Environment
ENVIRONMENT=development
```

### Frontend (`.env.local`)

```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## 📚 API Documentation

### Authentication Endpoints

#### Sign Up
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "farmer@example.com",
  "password": "SecurePassword123",
  "confirm_password": "SecurePassword123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "farmer@example.com"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "farmer@example.com",
  "password": "SecurePassword123"
}
```

### Crop Recommendation Endpoints

#### Predict Crop
```http
POST /predict-crop
Authorization: Bearer {token}
Content-Type: application/json

{
  "N": 90,
  "P": 42,
  "K": 43,
  "temperature": 28.5,
  "humidity": 60.0,
  "ph": 6.8,
  "rainfall": 200.0
}
```

**Response:**
```json
{
  "id": 1,
  "recommended_crop": "Rice"
}
```

#### Get Crop History
```http
GET /crop-history
Authorization: Bearer {token}
```

### Disease Detection Endpoints

#### Predict Disease (Upload Image)
```http
POST /predict-disease
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: <image_file>
```

**Response:**
```json
{
  "id": 1,
  "image_url": "https://cloudinary.com/...",
  "disease": "Leaf Blight",
  "confidence": 94.5,
  "symptoms": ["Brown spots on leaves", "..."],
  "treatment": ["Apply fungicide", "..."],
  "prevention": ["Improve air circulation", "..."]
}
```

#### Get Disease History
```http
GET /disease-history
Authorization: Bearer {token}
```

### Weather Advisory Endpoints

#### Weather by City
```http
GET /weather-advisory/New%20Delhi
Authorization: Bearer {token}
```

#### Weather by Location
```http
GET /weather-advisory-location?lat=28.6139&lon=77.2090
Authorization: Bearer {token}
```

---

## 💡 Usage Guide

### For Farmers

1. **Create Account:** Sign up with email and password
2. **Get Crop Recommendation:**
   - Enter soil parameters (NPK values)
   - Provide environmental data (temperature, humidity, pH, rainfall)
   - Receive AI-powered crop recommendation
3. **Detect Plant Diseases:**
   - Upload image of affected plant
   - Get disease identification and confidence score
   - View treatment and prevention methods
4. **Check Weather Advisory:**
   - Enter city name or enable location
   - Receive weather-based agricultural recommendations

### For Developers

- **Extend ML Models:** Replace model files in respective directories
- **Add New Features:** Follow FastAPI patterns in `backend/app.py`
- **Customize UI:** Modify React components in `frontend/src/`
- **Add API Endpoints:** Extend `backend/app.py` with new routes

---

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Backend Deployment (Render)

1. Create Render Web Service
2. Connect GitHub repository
3. Set environment variables
4. Configure build command: `pip install -r requirements.txt`
5. Configure start command: `uvicorn app:app --host 0.0.0.0`

### Database (PostgreSQL)

Use managed PostgreSQL service from:
- Render
- AWS RDS
- DigitalOcean
- Heroku Postgres

Update `DATABASE_URL` in environment variables.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Code Standards
- Follow PEP 8 for Python
- Follow ESLint rules for JavaScript/React
- Add comments for complex logic
- Write meaningful commit messages

---

## 📄 License

This project is open source and available under the MIT License. See the LICENSE file for details.

---

## 📞 Support & Contact

- **GitHub Issues:** [Report bugs or suggest features](https://github.com/Nihindu2002/AgriMind-AI-Smart-Agriculture-Intelligence-Platform/issues)
- **Email:** [Contact developer]
- **Live Demo:** [https://agri-mind-ai-smart-agriculture-inte.vercel.app](https://agri-mind-ai-smart-agriculture-inte.vercel.app)

---

## 🙏 Acknowledgments

- TensorFlow/Keras for deep learning models
- FastAPI for modern web framework
- React and Vite for frontend
- Cloudinary for image management
- OpenWeatherMap for weather data

---

## 📊 Project Statistics

- **Languages:** Jupyter Notebook (42.5%), JavaScript (27.2%), CSS (16.6%), Python (13.5%), HTML (0.2%)
- **Frontend:** React + Vite + Axios
- **Backend:** FastAPI + PostgreSQL + TensorFlow
- **Deployment:** Vercel + Render

---

**Made with ❤️ by Nihindu2002**

*Last Updated: June 2026*
