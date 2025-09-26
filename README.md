# 🧠 MediSense AI

**Intelligent Medical Report Analysis System**

An advanced AI-powered medical document analysis platform that transforms traditional medical reports into comprehensive, actionable insights using cutting-edge machine learning and natural language processing.


## 🌟 Features

### 🎯 **Core Functionality**
- **📄 PDF Analysis**: Upload medical reports for comprehensive AI analysis
- **🧠 Intelligent Processing**: Advanced NLP for medical document understanding
- **📊 Visual Insights**: Interactive charts and risk assessment visualizations
- **⚡ Real-time Analysis**: Instant processing with confidence scoring
- **🎨 Professional UI**: Medical-grade interface with healthcare-appropriate design

### 📈 **Interactive Visualizations**
- **Vital Signs Tracking**: Blood pressure, cholesterol, blood sugar trends
- **Risk Assessment Gauges**: Circular progress indicators for health risks
- **Medical Charts**: Interactive Recharts integration for data visualization
- **Health Metrics Dashboard**: BMI tracking and health trend analysis

### 🩺 **Medical Intelligence**
- **Condition Detection**: AI-powered identification of medical conditions
- **Risk Stratification**: Comprehensive risk assessment with confidence scores
- **Clinical Recommendations**: Personalized treatment and lifestyle recommendations
- **Monitoring Plans**: Structured follow-up and monitoring protocols

### 🎨 **Professional Interface**
- **Medical Icons**: Professional healthcare iconography
- **Glass Morphism**: Modern UI with medical gradients
- **Dashboard Layout**: Sidebar navigation with main content panels
- **Responsive Design**: Optimized for healthcare workflows

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+**
- **Node.js 14+**
- **npm or yarn**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ritik-gupta001/MediSense.AI
cd medisense-ai
```

2. **Backend Setup**
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

### Running the Application

1. **Start the Backend** (Terminal 1)
```bash
# From root directory
python app.py
```

2. **Start the Frontend** (Terminal 2)
```bash
# From frontend directory
cd frontend
npm start
```

3. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## 📁 Project Structure

```
MediSense AI/
├── 📄 README.md                 # Project documentation
├── 🐍 app.py                    # FastAPI backend server
├── 🧠 intelligent_analyzer.py   # Core AI analysis engine
├── 📦 requirements.txt          # Python dependencies
├── 🌐 frontend/                 # React frontend application
│   ├── 📦 package.json          # Node.js dependencies
│   ├── 🎨 tailwind.config.js    # Tailwind CSS configuration
│   ├── 🌐 public/
│   │   └── 📄 index.html        # HTML template
│   └── 💻 src/
│       ├── 🎯 App.js            # Main application component
│       ├── 🎨 index.css         # Global styles
│       ├── 🚀 index.js          # Application entry point
│       ├── 🧩 components/       # React components
│       │   ├── 📊 Dashboard.js         # Main dashboard layout
│       │   ├── 💬 ChatInterface.js     # Chat interface
│       │   ├── 👨‍⚕️ DoctorSummary.js      # Clinical assessment
│       │   ├── 📁 FileUpload.js        # File upload component
│       │   ├── 🏥 MedicalIcons.js      # Professional medical icons
│       │   ├── 👤 PatientSummary.js    # Patient insights
│       │   ├── ⚠️ RiskGauge.js          # Risk visualization
│       │   ├── 🔍 SHAPVisualization.js # SHAP explanations
│       │   └── 📈 VitalCharts.js       # Interactive vital charts
│       ├── 🔧 services/
│       │   └── 🌐 api.js               # API service layer
│       ├── 🧪 tests/
│       │   └── ⚡ App.test.js         # Unit tests
│       └── 🛠️ utils/
│           └── ⚙️ constants.js        # Application constants
└── 🐍 venv/                     # Python virtual environment
```

## 🛠️ Technology Stack

### Backend
- **🐍 FastAPI**: Modern, fast web framework for building APIs
- **🤖 scikit-learn**: Machine learning library for medical analysis
- **📊 pandas**: Data manipulation and analysis
- **📈 numpy**: Numerical computing for healthcare data
- **📄 PyPDF2**: PDF processing for medical documents
- **🧠 transformers**: Advanced NLP for medical text analysis

### Frontend
- **⚛️ React 18**: Modern JavaScript library for user interfaces
- **📊 Recharts**: Interactive charting library for medical visualizations
- **⭕ React-Circular-Progressbar**: Circular progress indicators for risk assessment
- **🎨 Tailwind CSS**: Utility-first CSS framework for medical UI
- **📋 HTML2Canvas + jsPDF**: PDF generation for medical reports

### AI/ML Features
- **🧠 Natural Language Processing**: Medical document understanding
- **📊 Risk Assessment**: Multi-factor health risk analysis
- **🎯 Condition Detection**: AI-powered medical condition identification
- **📈 Trend Analysis**: Health metric tracking and visualization

## 🩺 Medical Features

### 📋 **Analysis Capabilities**
- **Laboratory Results**: Comprehensive lab value interpretation
- **Vital Signs**: Blood pressure, heart rate, temperature analysis
- **Medical History**: Chronic condition and medication tracking
- **Risk Factors**: Cardiovascular, diabetic, and metabolic risk assessment

### 🎯 **AI Intelligence**
- **Confidence Scoring**: AI prediction reliability metrics
- **Clinical Correlation**: Cross-referenced medical knowledge base
- **Personalized Recommendations**: Tailored healthcare guidance
- **Monitoring Protocols**: Structured follow-up plans

### 📊 **Visualization Types**
- **Line Charts**: Vital sign trends over time
- **Area Charts**: Cholesterol and lipid profiles
- **Bar Charts**: Blood sugar and glucose monitoring
- **Pie Charts**: Health metric distributions
- **Risk Gauges**: Circular risk assessment indicators

## 🔧 API Documentation

### Core Endpoints

#### `POST /analyze`
Upload and analyze medical PDF documents
```json
{
  "file": "medical_report.pdf"
}
```

#### `GET /demo`
Load demonstration medical analysis
```json
{
  "analysis": {
    "patient_summary": {...},
    "doctor_summary": {...},
    "risk_assessment": {...}
  }
}
```

#### `GET /health`
Health check endpoint
```json
{
  "status": "healthy",
  "timestamp": "2025-09-27T00:00:00Z"
}
```

## 🎨 UI Components

###  **Dashboard Components**
- **Sidebar Navigation**: Upload, History, Dashboard tabs
- **Content Panels**: Expandable sections for different insights
- **Medical Icons**: Professional healthcare iconography
- **Risk Gauges**: Circular progress risk visualization

###  **Chart Components**
- **VitalCharts**: Interactive medical trend visualization
- **RiskGauge**: Circular progress risk assessment
- **Medical Timeline**: Health event tracking
- **Condition Cards**: Medical condition summaries

##  Security & Privacy

- ** HIPAA Considerations**: Healthcare data privacy compliance ready
- ** Data Encryption**: Secure data transmission and storage
- ** Access Control**: Role-based permissions system ready
- ** Session Management**: Secure user session handling

##  Deployment

### Development
```bash
# Backend
python app.py

# Frontend
cd frontend && npm start
```

### Production
```bash
# Backend with Gunicorn
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app:app

# Frontend build
cd frontend
npm run build
```

##  Testing

### Backend Tests
```bash
pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

### E2E Testing
```bash
npm run test:e2e
```

##  Roadmap

###  **Phase 1: Foundation** (Completed)
- [x] PDF document processing
- [x] Basic AI analysis
- [x] React frontend setup
- [x] Professional medical UI

###  **Phase 2: Professional Interface** (Completed)
- [x] Medical-grade icons
- [x] Dashboard architecture
- [x] Interactive visualizations
- [x] Risk assessment gauges

###  **Phase 3: Advanced Features** (In Progress)
- [ ] Smart alerts & confidence scores
- [ ] Medication interpretation
- [ ] Downloadable PDF reports
- [ ] Dark mode & theming

###  **Phase 4: Production** (Planned)
- [ ] Multi-language support (Hindi, regional languages)
- [ ] Mobile responsiveness
- [ ] Cloud deployment
- [ ] Healthcare integrations

##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Disclaimer

**Important Medical Disclaimer**: MediSense AI is designed as an assistive tool for healthcare professionals and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical decisions. The AI analysis should be used in conjunction with, not as a replacement for, professional medical judgment.

##  Support

- ** Email**: support@medisense-ai.com
- ** Issues**: [GitHub Issues](https://github.com/ritik-gupta001/medisense-ai/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/ritik-gupta001/medisense-ai/discussions)

## Acknowledgments

- **Healthcare Professionals**: For domain expertise and feedback
- **Open Source Community**: For the amazing libraries and tools
- **AI Research**: For advancing medical NLP and analysis capabilities

---

<div align="center">

** MediSense AI - Transforming Healthcare Through Intelligent Analysis**

![Healthcare](https://img.shields.io/badge/Healthcare-Innovation-brightgreen?style=flat-square&logo=medical-cross)
![AI](https://img.shields.io/badge/AI-Powered-blue?style=flat-square&logo=brain)
![React](https://img.shields.io/badge/React-18.0-61dafb?style=flat-square&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688?style=flat-square&logo=fastapi)

Made with  for Healthcare Professionals

</div>