# 🏥 MediSense AI

**Advanced AI-Powered Medical Report Analysis Platform**

A comprehensive medical document analysis system that leverages OpenAI GPT-4o-mini and advanced AI to transform medical reports into actionable insights. Features dynamic risk calculation, dark/light themes, and multi-format report downloads.

## video Demo


https://github.com/user-attachments/assets/47c268bb-f969-43c0-82ef-aaeefe59d7e7



## 🌟 Key Features

### 🎯 **Core Functionality**
- **📄 PDF Analysis**: Upload medical reports for comprehensive AI analysis with OpenAI integration
- **🧠 Dynamic Risk Assessment**: Real AI-calculated risk percentages
- **📊 Interactive Visualizations**: Real-time charts, gauges, and medical insights
- **🌙 Dark/Light Mode**: Complete theme system with user preference persistence
- **📥 Download Reports**: Export analysis in PDF, TXT, and JSON formats
- **⚡ Optimized Performance**: Fast analysis with intelligent timeout handling

### 🎨 **Professional Interface**
- **🖥️ Modern UI**: Clean, medical-grade interface with theme support
- **📱 Responsive Design**: Works seamlessly on all devices
- **🎯 Intuitive Navigation**: User-friendly upload and analysis workflow
- **⚡ Smooth Animations**: Professional transitions and loading states

### � **AI Intelligence**
- **OpenAI GPT-4o-mini**: Latest AI model for medical analysis
- **Dynamic Risk Calculation**: Real percentage calculation based on content analysis
- **Intelligent Fallbacks**: Robust error handling with backup analysis systems
- **Medical Knowledge Base**: Comprehensive medical guidelines and reference data

## 🚀 Quick Start

### 1. Configure Environment
Create/edit the `.env` file:
```env
OPENAI_API_KEY=your-openai-api-key-here
```

### 2. Install Dependencies
```bash
# Backend dependencies
pip install -r requirements.txt

# Frontend dependencies  
cd frontend
npm install
```

### 3. Start the Application

**Option A: Manual Start**
```bash
# Terminal 1: Start Backend
python app.py

# Terminal 2: Start Frontend
cd frontend
npm start
```

**Option B: Using Provided Scripts**
```bash
# Windows
.\start-servers.bat

# PowerShell
.\run-medisense.ps1
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000  
- **API Documentation**: http://localhost:8000/docs
- Use the AI chat assistant for medical questions

## ✨ Key Features
- 🔍 AI-powered medical document analysis
- 📊 Comprehensive health reports  
- 💬 Smart medical chat assistant
- 📈 Risk assessment and recommendations

## Prerequisites

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
├── 📄 README.md                    # Project documentation  
├── 🐍 app.py                       # FastAPI backend server
├── 🧠 intelligent_analyzer.py      # Core AI analysis engine
├── 🤖 llm_analyzer.py              # OpenAI GPT integration
├── 📦 requirements.txt             # Python dependencies
├── 🔐 .env                         # Environment variables
├── 🌐 frontend/                    # React frontend application
│   ├── 📦 package.json             # Node.js dependencies
│   ├── 🎨 tailwind.config.js       # Tailwind CSS configuration
│   ├── 🌐 public/
│   │   └── 📄 index.html           # HTML template
│   └── 💻 src/
│       ├── 🎯 App.js               # Main application component
│       ├── 🎨 index.css            # Global styles with theme support
│       ├── 🚀 index.js             # Application entry point
│       ├── 🧩 components/          # React components
│       │   ├── 📊 Dashboard.js            # Main dashboard with theme toggle
│       │   ├── 💬 AIChatInterface.js      # AI chat interface
│       │   ├──  FileUpload.js           # File upload component
│       │   ├── 🏥 MedicalIcons.js         # Professional medical icons
│       │   ├── 👤 PatientSummary.js       # Patient insights
│       │   ├── ⚠️ RiskGauge.js             # Dynamic risk visualization
│       │   ├── � VitalCharts.js          # Interactive vital charts
│       │   ├── 🌙 ThemeToggle.js          # Dark/Light mode toggle
│       │   ├── 📥 DownloadReport.js       # Multi-format download
│       │   └── 🎨 ThemedUploadView.js     # Theme-aware upload interface
│       ├── 🎨 contexts/            # React contexts
│       │   └── 🌈 ThemeContext.js         # Theme management context
│       ├── 🔧 services/
│       │   └── 🌐 api.js                  # API service layer
│       ├── 🧪 tests/
│       │   └── ⚡ App.test.js            # Unit tests
│       └── 🛠️ utils/
└── 🐍 venv/                        # Python virtual environment
```

## 🛠️ Technology Stack

### Backend
- **🐍 FastAPI**: Modern, fast web framework for building APIs
- **🤖 OpenAI GPT-4o-mini**: Latest AI model for medical text analysis
- **📊 pandas**: Data manipulation and analysis
- **📈 numpy**: Numerical computing for healthcare data
- **📄 PyPDF2**: PDF processing for medical documents
- **🔐 python-dotenv**: Environment variable management

### Frontend
- **⚛️ React 18**: Modern JavaScript library with hooks and context
- **📊 Recharts**: Interactive charting library for medical visualizations
- **⭕ React-Circular-Progressbar**: Dynamic risk assessment gauges
- **🎨 Tailwind CSS**: Utility-first CSS framework with theme support
- **📋 HTML2Canvas + jsPDF**: Client-side PDF generation for reports
- **🌐 Axios**: HTTP client for API communication

### AI/ML Features
- **🧠 OpenAI Integration**: GPT-4o-mini for advanced medical analysis
- **📊 Dynamic Risk Assessment**: AI-calculated risk percentages
- **🎯 Intelligent Analysis**: Context-aware medical document understanding
- **� Pattern Recognition**: Health trend analysis and visualization

### New Features
- **� Theme System**: Complete dark/light mode with localStorage persistence
- **📥 Multi-format Downloads**: PDF, TXT, and JSON report exports
- **⚡ Performance Optimization**: Improved timeout handling and user experience
- **� Dynamic Updates**: Real-time risk calculation without hardcoded values

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

## 🗺️ Roadmap

### ✅ **Phase 1: Foundation** (Completed)
- [x] PDF document processing and text extraction
- [x] OpenAI GPT-4o-mini integration
- [x] React frontend with professional UI
- [x] FastAPI backend with comprehensive endpoints

### ✅ **Phase 2: Core Features** (Completed)
- [x] Dynamic AI risk calculation
- [x] Interactive medical visualizations  
- [x] Professional medical icons and interface
- [x] Real-time analysis with proper error handling

### ✅ **Phase 3: Advanced Features** (Completed)
- [x] 🌙 Dark/Light mode theme system with persistence
- [x] 📥 Multi-format report downloads (PDF, TXT, JSON)
- [x] ⚡ Performance optimization and timeout improvements
- [x] 🧹 Code cleanup and component optimization

### 🔄 **Phase 4: Enhancements** (In Progress)
- [ ] 📱 Enhanced mobile responsiveness
- [ ] 🔔 Smart alerts and notifications
- [ ] 💊 Advanced medication interpretation
- [ ] 🌍 Multi-language support

### 🎯 **Phase 5: Production** (Planned)
- [ ] ☁️ Cloud deployment and scaling
- [ ] 🔐 Enhanced security and HIPAA compliance
- [ ] 🏥 Healthcare system integrations
- [ ] 📊 Advanced analytics dashboard

### 🚀 **Recent Achievements**
- **Fixed Risk Hallucination**:Eliminated hardcoded 85% risk values with dynamic AI calculation
- **Theme System**: Complete dark/light mode with user preference persistence  
- **Download Functionality**: Professional report generation in multiple formats
- **Performance Optimization**: Improved analysis speed and reliability
- **Clean Architecture**: Removed unused components and optimized codebase

## 🔧 Recent Improvements

### 🎯 **Major Bug Fixes**
- **Fixed 85% Risk Hallucination**: The application was showing hardcoded 85% risk values regardless of actual content,hence it get fixed based on AI based analysis
- **Enhanced OpenAI Integration**: Improved prompts to specifically request percentage calculations from GPT-4o-mini
- **Performance Optimization**: Increased API timeouts and optimized analysis speed

### 🌟 **New Features**
- **🌙 Complete Theme System**: Dark/light mode toggle with localStorage persistence and system preference detection
- **📥 Multi-format Downloads**: Professional report generation in PDF/HTML, TXT, and JSON formats
- **🎨 Enhanced UI**: Theme-aware components with smooth transitions and professional styling
- **🧹 Code Cleanup**: Removed unused components (SHAPVisualization, DoctorSummary) and optimized project structure

### ⚡ **Performance Enhancements**
- **Faster Analysis**: Optimized OpenAI API calls with proper timeout handling
- **Better Error Handling**: Robust fallback systems for AI analysis
- **Cleaner Codebase**: Removed unnecessary files and improved project organization
- **Responsive Design**: Better mobile and desktop compatibility

## 🎯 How to Use New Features

### 🌙 Theme Toggle
- Look for the 🌙/☀️ button in the interface
- Toggle between dark and light modes
- Preference is automatically saved and restored

### 📥 Download Reports  
- After analysis, find the download button
- Choose from PDF, TXT, or JSON formats
- Reports include patient info, analysis, and recommendations

### ⚡ Dynamic Risk Assessment
- Upload any medical PDF
- See realistic risk percentages based on actual content
- Risk values now vary appropriately instead of showing constant 85%

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

- ** Email**: rg409239@gmail.com
- ** Issues**: [GitHub Issues](https://github.com/ritik-gupta001/medisense-ai/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/ritik-gupta001/medisense-ai/discussions)

## Acknowledgments

- **Healthcare Professionals**: For domain expertise and feedback
- **Open Source Community**: For the amazing libraries and tools
- **OpenAI**: For providing powerful GPT-4o-mini API for medical analysis
- **AI Research**: For advancing medical NLP and analysis capabilities

---

<div align="center">

**🏥 MediSense AI - Advanced Medical Intelligence Platform**

![Healthcare](https://img.shields.io/badge/Healthcare-Innovation-brightgreen?style=flat-square&logo=medical-cross)
![AI](https://img.shields.io/badge/OpenAI-GPT4o--mini-blue?style=flat-square&logo=openai)
![React](https://img.shields.io/badge/React-18.0-61dafb?style=flat-square&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688?style=flat-square&logo=fastapi)
![Themes](https://img.shields.io/badge/Theme-Dark%2FLight-purple?style=flat-square&logo=material-design)
![Downloads](https://img.shields.io/badge/Download-PDF%2FTXT%2FJSON-orange?style=flat-square&logo=download)

**✨ Now with Dynamic Risk Calculation, Theme System & Multi-format Downloads ✨**

*Transforming Healthcare Through Intelligent AI Analysis*

</div>
