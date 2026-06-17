import { useEffect, useState } from "react";
import "./App.css";
import logoMark from "./assets/agrimind-logo.svg";
import GoogleLoginButton from "./GoogleLoginButton";
import CropPredictionForm from "./CropPredictionForm";
import CropHistory from "./CropHistory";
import PlantDiseaseUpload from "./PlantDiseaseUpload";
import DiseaseHistory from "./DiseaseHistory";
import WeatherAdvisory from "./WeatherAdvisory";

const featureLinks = [
  { label: "Crop Recommendation", href: "#crop-recommendation" },
  { label: "Disease Detection", href: "#disease-detection" },
  { label: "Weather Advisory", href: "#weather-advisory" },
];

const featureCards = [
  {
    id: "crop-recommendation",
    tag: "AI Crop Match",
    title: "Crop Recommendation",
    description:
      "Recommend suitable crops from nitrogen, phosphorus, potassium, pH, rainfall, humidity, and temperature inputs.",
    metric: "Soil + climate intelligence",
    details: ["NPK + pH inputs", "Rainfall and temperature", "Saved prediction history"],
  },
  {
    id: "disease-detection",
    tag: "Vision AI",
    title: "Disease Detection",
    description:
      "Upload a leaf image to identify plant disease patterns with confidence, symptoms, treatment, and prevention guidance.",
    metric: "Image-based diagnosis",
    details: ["Leaf image preview", "Confidence score", "Treatment and prevention"],
  },
  {
    id: "weather-advisory",
    tag: "Farm Weather",
    title: "Weather Advisory",
    description:
      "Generate city-based weather insights for temperature, humidity, rainfall, wind, and timely farming recommendations.",
    metric: "Localized field advice",
    details: ["City weather lookup", "Rainfall and wind checks", "Farming advice list"],
  },
];

const workflowSteps = [
  {
    number: "01",
    title: "Authenticate",
    text: "Secure access keeps predictions and disease scans linked to the farmer workspace.",
  },
  {
    number: "02",
    title: "Capture Field Signals",
    text: "Submit soil nutrients, leaf images, or city weather context through focused input panels.",
  },
  {
    number: "03",
    title: "Act With Confidence",
    text: "Review recommendations, advisory notes, and prediction history in one clean dashboard.",
  },
];

const systemSlides = [
  {
    id: "crop-recommendation",
    eyebrow: "Crop Recommendation",
    title: "Soil profile matched to crop suitability",
    subtitle: "NPK, rainfall, pH, humidity, and temperature inputs are grouped into a field-ready recommendation.",
    status: "Recommendation ready",
    primaryMetric: "Rice",
    secondaryMetric: "Best crop match",
    fields: [
      { label: "Nitrogen", value: "90" },
      { label: "Phosphorus", value: "42" },
      { label: "Potassium", value: "43" },
      { label: "pH", value: "6.5" },
    ],
    notes: ["High rainfall fit", "Balanced nutrient profile", "History saved after prediction"],
  },
  {
    id: "disease-detection",
    eyebrow: "Disease Detection",
    title: "Leaf image reviewed with disease guidance",
    subtitle: "Disease predictions include confidence, symptoms, treatment, prevention notes, and stored scan history.",
    status: "Scan complete",
    primaryMetric: "94%",
    secondaryMetric: "Model confidence",
    fields: [
      { label: "Image", value: "Leaf upload" },
      { label: "Result", value: "Blight" },
      { label: "Symptoms", value: "4" },
      { label: "Actions", value: "6" },
    ],
    notes: ["Treatment plan listed", "Prevention steps included", "Image record retained"],
  },
  {
    id: "weather-advisory",
    eyebrow: "Weather Advisory",
    title: "Weather context converted into farming advice",
    subtitle: "City weather is translated into useful recommendations for rainfall, wind, humidity, and field timing.",
    status: "Advisory updated",
    primaryMetric: "28°C",
    secondaryMetric: "Current field temperature",
    fields: [
      { label: "Humidity", value: "78%" },
      { label: "Rainfall", value: "6 mm" },
      { label: "Wind", value: "12 km/h" },
      { label: "Advice", value: "Irrigate later" },
    ],
    notes: ["Rainfall considered", "Wind speed checked", "Localized city lookup"],
  },
];

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
}

function ProductSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = systemSlides[activeIndex];

  useEffect(() => {
    const slideTimer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % systemSlides.length);
    }, 4200);

    return () => window.clearInterval(slideTimer);
  }, []);

  return (
    <div className="product-showcase" aria-label="AgriMind AI system slideshow">
      <div className="showcase-topbar">
        <div className="showcase-window-controls" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span className="showcase-status">{activeSlide.status}</span>
      </div>

      <div className="showcase-tabs" aria-label="Preview controls">
        {systemSlides.map((slide, index) => (
          <button
            className={index === activeIndex ? "showcase-tab active" : "showcase-tab"}
            key={slide.id}
            onClick={() => setActiveIndex(index)}
            type="button"
          >
            {slide.eyebrow}
          </button>
        ))}
      </div>

      <div className="showcase-slide" key={activeSlide.id}>
        <div className="slide-main">
          <p className="eyebrow">{activeSlide.eyebrow}</p>
          <h3>{activeSlide.title}</h3>
          <p>{activeSlide.subtitle}</p>

          <div className="slide-metric">
            <strong>{activeSlide.primaryMetric}</strong>
            <span>{activeSlide.secondaryMetric}</span>
          </div>
        </div>

        <div className="slide-fields">
          {activeSlide.fields.map((field) => (
            <div className="slide-field" key={field.label}>
              <span>{field.label}</span>
              <strong>{field.value}</strong>
            </div>
          ))}
        </div>

        <div className="slide-notes">
          {activeSlide.notes.map((note) => (
            <span key={note}>{note}</span>
          ))}
        </div>

        <div className="slide-progress" aria-hidden="true">
          {systemSlides.map((slide, index) => (
            <span className={index === activeIndex ? "active" : ""} key={slide.id}></span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Navbar({ user, onLogout }) {
  const userInitial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "A";

  return (
    <header className="site-navbar">
      <div className="container nav-container">
        <a className="brand" href="#top" aria-label="AgriMind AI home">
          <img className="brand-logo" src={logoMark} alt="" />
          <span>AgriMind AI</span>
        </a>

        <nav className="feature-nav" aria-label="Main feature navigation">
          {featureLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        {user ? (
          <div className="nav-account" aria-label="User account">
            <div className="user-chip">
              <span className="user-avatar">{userInitial}</span>
              <span className="user-name">{user.name}</span>
            </div>
            <button className="btn btn-ghost btn-small" onClick={onLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="nav-account nav-auth" aria-label="Sign in status">
            <span className="signed-out-chip">
              <span className="status-dot"></span>
              Not signed in
            </span>
            <a className="btn btn-ghost btn-small nav-signin-link" href="#auth">
              Sign in
            </a>
          </div>
        )}
      </div>
    </header>
  );
}

function HeroSection({ user }) {
  return (
    <section className="hero-section" id="top">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Smart Agriculture Intelligence Platform</p>
          <h1>AgriMind AI</h1>
          <p className="hero-subtitle">
            AI-powered agriculture intelligence for smarter crop decisions,
            disease detection, and weather-based farming advice.
          </p>

          <div className="hero-actions" aria-label="Primary actions">
            <a
              className="btn btn-primary"
              href={user ? "#crop-recommendation" : "#auth"}
            >
              Get Started
            </a>
            <a className="btn btn-secondary" href="#feature-overview">
              Explore Features
            </a>
          </div>

          <div className="hero-stats" aria-label="Platform highlights">
            <span>Crop AI</span>
            <span>Disease Vision</span>
            <span>Weather Advice</span>
          </div>

          <div className="hero-insight-grid" aria-label="System snapshot">
            <div>
              <span>Inputs</span>
              <strong>Soil, leaf, weather</strong>
            </div>
            <div>
              <span>Records</span>
              <strong>Prediction history</strong>
            </div>
            <div>
              <span>Access</span>
              <strong>Google secured</strong>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <ProductSlideshow />
        </div>
      </div>
    </section>
  );
}

function FeatureOverview({ authenticated }) {
  return (
    <section className="section" id="feature-overview">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">Feature Overview</p>
          <h2>Three intelligent tools for modern farming decisions</h2>
          <p>
            AgriMind AI combines machine learning, computer vision, and weather
            context into a focused agriculture workflow.
          </p>
        </div>

        <div className="feature-grid">
          {featureCards.map((feature) => (
            <article
              className="feature-card glass-card reveal-card"
              id={authenticated ? undefined : feature.id}
              key={feature.id}
            >
              <div className="card-topline">
                <span className="feature-badge">{feature.tag}</span>
                <span className="card-index">
                  {feature.id === "crop-recommendation"
                    ? "01"
                    : feature.id === "disease-detection"
                      ? "02"
                      : "03"}
                </span>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <ul className="feature-points">
                {feature.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
              <a className="feature-link" href={`#${feature.id}`}>
                {feature.metric}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="section section-muted" id="how-it-works">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">How It Works</p>
          <h2>From field data to practical recommendations</h2>
          <p>
            The experience is built around clear inputs, fast model responses,
            and saved intelligence that is easy to review during a demo.
          </p>
        </div>

        <div className="workflow-grid">
          {workflowSteps.map((step) => (
            <article className="workflow-card" key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AuthPanel({ onLoginSuccess }) {
  return (
    <section className="section auth-section" id="auth">
      <div className="container auth-layout">
        <div className="auth-copy">
          <p className="eyebrow">Google Auth</p>
          <h2>Sign in to open the AgriMind AI workspace</h2>
          <p>
            Continue with Google to access crop prediction history, disease scan
            records, and the live advisory tools.
          </p>
        </div>

        <div className="auth-card glass-card reveal-card">
          <span className="secure-label">Secure demo access</span>
          <GoogleLoginButton onLoginSuccess={onLoginSuccess} />
        </div>
      </div>
    </section>
  );
}

function AuthenticatedWorkspace({
  refreshHistory,
  refreshDiseaseHistory,
  onPredictionSaved,
  onDiseaseSaved,
}) {
  return (
    <div className="workspace">
      <section className="app-section" id="crop-recommendation">
        <div className="container">
          <div className="section-heading section-heading-left">
            <p className="eyebrow">Crop Recommendation</p>
            <h2>Match field conditions with the right crop</h2>
          </div>

          <div className="tool-grid tool-grid-two">
            <article className="tool-card glass-card reveal-card">
              <CropPredictionForm onPredictionSaved={onPredictionSaved} />
            </article>
            <article className="tool-card glass-card history-card reveal-card">
              <CropHistory refreshHistory={refreshHistory} />
            </article>
          </div>
        </div>
      </section>

      <section className="app-section" id="disease-detection">
        <div className="container">
          <div className="section-heading section-heading-left">
            <p className="eyebrow">Disease Detection</p>
            <h2>Analyze leaf images and review diagnosis history</h2>
          </div>

          <div className="tool-grid tool-grid-two">
            <article className="tool-card glass-card reveal-card">
              <PlantDiseaseUpload onDiseaseSaved={onDiseaseSaved} />
            </article>
            <article className="tool-card glass-card history-card reveal-card">
              <DiseaseHistory refreshDiseaseHistory={refreshDiseaseHistory} />
            </article>
          </div>
        </div>
      </section>

      <section className="app-section" id="weather-advisory">
        <div className="container">
          <div className="section-heading section-heading-left">
            <p className="eyebrow">Weather Advisory</p>
            <h2>Plan field action with localized weather intelligence</h2>
          </div>

          <div className="tool-grid">
            <article className="tool-card glass-card tool-card-wide reveal-card">
              <WeatherAdvisory />
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <span>AgriMind AI</span>
        <p>Smart Agriculture Intelligence Platform for crop, disease, and weather decisions.</p>
      </div>
    </footer>
  );
}

function App() {
  const [refreshHistory, setRefreshHistory] = useState(false);
  const [refreshDiseaseHistory, setRefreshDiseaseHistory] = useState(false);
  const [user, setUser] = useState(getStoredUser);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div className="app-shell">
      <Navbar user={user} onLogout={handleLogout} />

      <main>
        <HeroSection user={user} />
        <FeatureOverview authenticated={Boolean(user)} />
        <HowItWorks />

        {!user ? (
          <AuthPanel onLoginSuccess={setUser} />
        ) : (
          <AuthenticatedWorkspace
            refreshHistory={refreshHistory}
            refreshDiseaseHistory={refreshDiseaseHistory}
            onPredictionSaved={() => setRefreshHistory((prev) => !prev)}
            onDiseaseSaved={() => setRefreshDiseaseHistory((prev) => !prev)}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
