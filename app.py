from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uvicorn
from intelligent_analyzer import MedicalTextAnalyzer
from llm_analyzer import analyze_medical_document_llm, chat_with_medical_ai, get_health_insights, check_ai_status
import logging
import PyPDF2
import io
import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="MediSense AI", 
    description="Advanced AI-Powered Medical Report Analysis API with LLM and RAG",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "https://*.netlify.app",
        "https://medisense-ai.netlify.app",
        "https://*.onrender.com",
        "https://medisense-ai-frontend.onrender.com",
        "https://medisurre-ai.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize analyzers
legacy_analyzer = MedicalTextAnalyzer()

# Pydantic models for request/response
class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = None
    conversation_id: Optional[str] = None

class TextAnalysisRequest(BaseModel):
    text: str
    filename: Optional[str] = "text_input.txt"
    use_llm: Optional[bool] = True

class HealthInsightsRequest(BaseModel):
    analysis_data: dict

def extract_text_from_pdf(pdf_content):
    """Extract text content from PDF file"""
    try:
        pdf_file = io.BytesIO(pdf_content)
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        
        text_content = ""
        for page in pdf_reader.pages:
            text_content += page.extract_text() + "\n"
        
        return text_content.strip()
    except Exception as e:
        raise Exception(f"Failed to extract text from PDF: {str(e)}")

@app.get("/")
async def root():
    return {
        "message": "MediSense AI - Advanced Medical Report Analysis API", 
        "status": "running",
        "version": "2.0.0",
        "features": ["LLM Analysis", "RAG Support", "AI Chatbot", "Medical Knowledge Base"]
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "analyzers": {
            "legacy": "ready",
            "llm": "ready" if os.getenv('OPENAI_API_KEY') or os.getenv('ANTHROPIC_API_KEY') else "needs_api_key"
        },
        "features": {
            "rag": bool(os.getenv('ENABLE_RAG', 'true').lower() == 'true'),
            "chatbot": bool(os.getenv('ENABLE_CHATBOT', 'true').lower() == 'true')
        }
    }

@app.get("/ai-status")
async def ai_status():
    """Check AI configuration status"""
    return check_ai_status()

@app.post("/analyze")
async def analyze_document(file: UploadFile = File(...), use_llm: bool = True):
    try:
        # Validate file type
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Please upload a PDF file. Other formats are not supported yet.")
        
        # Read file content
        content = await file.read()
        
        logger.info(f"Analyzing PDF document: {file.filename}")
        
        # Extract text from PDF
        try:
            text_content = extract_text_from_pdf(content)
            if not text_content.strip():
                raise HTTPException(status_code=400, detail="No text found in the PDF. Please ensure the PDF contains readable text.")
        except Exception as e:
            logger.error(f"PDF extraction error: {str(e)}")
            raise HTTPException(status_code=400, detail=f"Failed to extract text from PDF: {str(e)}")
        
        # Choose analysis method
        if use_llm and (os.getenv('OPENAI_API_KEY') or os.getenv('ANTHROPIC_API_KEY')):
            logger.info("Using LLM-powered analysis")
            analysis_result = analyze_medical_document_llm(text_content)
        else:
            logger.info("Using legacy rule-based analysis")
            analysis_result = legacy_analyzer.analyze_medical_document(text_content, file.filename)
        
        logger.info("Analysis completed successfully")
        
        return JSONResponse(content={
            "success": True,
            "filename": file.filename,
            "analysis": analysis_result,
            "analysis_type": "LLM-powered" if use_llm else "Rule-based"
        })
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error analyzing document: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/analyze-text")
async def analyze_text(request: TextAnalysisRequest):
    try:
        text_content = request.text
        filename = request.filename
        use_llm = request.use_llm
        
        if not text_content.strip():
            raise HTTPException(status_code=400, detail="Text content is required")
        
        logger.info("Analyzing text input")
        
        # Choose analysis method
        if use_llm and (os.getenv('OPENAI_API_KEY') or os.getenv('ANTHROPIC_API_KEY')):
            logger.info("Using LLM-powered text analysis")
            analysis_result = analyze_medical_document_llm(text_content)
        else:
            logger.info("Using legacy rule-based text analysis")
            analysis_result = legacy_analyzer.analyze_medical_document(text_content, filename)
        
        logger.info("Text analysis completed successfully")
        
        return JSONResponse(content={
            "success": True,
            "filename": filename,
            "analysis": analysis_result,
            "analysis_type": "LLM-powered" if use_llm else "Rule-based"
        })
        
    except Exception as e:
        logger.error(f"Error analyzing text: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Text analysis failed: {str(e)}")

@app.post("/chat")
async def chat_with_ai(request: ChatRequest):
    """AI Chatbot endpoint for medical questions and conversations"""
    try:
        if not os.getenv('OPENAI_API_KEY') and not os.getenv('ANTHROPIC_API_KEY'):
            raise HTTPException(
                status_code=503, 
                detail="AI Chat service unavailable. Please configure API keys."
            )
        
        logger.info(f"Processing chat message: {request.message[:50]}...")
        
        chat_response = chat_with_medical_ai(request.message, request.context)
        
        return JSONResponse(content={
            "success": True,
            "response": chat_response["response"],
            "sources": chat_response.get("sources", []),
            "conversation_id": chat_response.get("conversation_id"),
            "timestamp": chat_response.get("timestamp")
        })
        
    except Exception as e:
        logger.error(f"Error in chat: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

@app.post("/health-insights")
async def generate_health_insights(request: HealthInsightsRequest):
    """Generate additional health insights based on analysis data"""
    try:
        if not os.getenv('OPENAI_API_KEY') and not os.getenv('ANTHROPIC_API_KEY'):
            raise HTTPException(
                status_code=503, 
                detail="Health insights service unavailable. Please configure API keys."
            )
        
        logger.info("Generating health insights")
        
        insights = get_health_insights(request.analysis_data)
        
        return JSONResponse(content={
            "success": True,
            "insights": insights
        })
        
    except Exception as e:
        logger.error(f"Error generating insights: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Insights generation failed: {str(e)}")

@app.get("/demo")
async def get_demo_analysis():
    try:
        demo_text = """
        MEDICAL REPORT
        
        Patient Name: Sarah Johnson
        Date of Birth: March 15, 1979
        Age: 45 years
        Gender: Female
        Date of Report: January 15, 2024
        
        CHIEF COMPLAINT:
        Routine health checkup and follow-up for elevated cholesterol levels
        
        LABORATORY RESULTS:
        
        LIPID PANEL:
        - Total Cholesterol: 245 mg/dL (High - Normal <200)
        - LDL Cholesterol: 165 mg/dL (High - Normal <100)
        - HDL Cholesterol: 42 mg/dL (Low - Normal >50 for women)
        - Triglycerides: 180 mg/dL (Borderline high - Normal <150)
        
        GLUCOSE METABOLISM:
        - Fasting Glucose: 110 mg/dL (Impaired - Normal 70-99)
        - HbA1c: 6.2% (Prediabetes - Normal <5.7%)
        
        VITAL SIGNS:
        - Blood Pressure: 145/92 mmHg (Stage 1 Hypertension)
        - Heart Rate: 76 bpm
        - BMI: 28.5 kg/m² (Overweight)
        
        CLINICAL ASSESSMENT:
        Patient presents with multiple cardiovascular risk factors including hyperlipidemia, 
        prediabetes, and mild hypertension. Current lifestyle factors contribute to these 
        metabolic abnormalities.
        
        RECOMMENDATIONS:
        1. Initiate statin therapy for cholesterol management
        2. Implement diabetes prevention program
        3. Dietary consultation for weight management
        4. Regular exercise program - minimum 150 minutes moderate activity per week
        5. Blood pressure monitoring and potential antihypertensive therapy
        6. Follow-up in 3 months to assess response to interventions
        
        Dr. Michael Chen, MD
        Internal Medicine
        """
        
        logger.info("Running demo analysis")
        
        # Use LLM analysis if available, otherwise fall back to legacy
        if os.getenv('OPENAI_API_KEY') or os.getenv('ANTHROPIC_API_KEY'):
            analysis_result = analyze_medical_document_llm(demo_text)
        else:
            analysis_result = legacy_analyzer.analyze_medical_document(demo_text, "demo_medical_report.pdf")
        
        return JSONResponse(content={
            "success": True,
            "filename": "demo_medical_report.pdf",
            "analysis": analysis_result
        })
        
    except Exception as e:
        logger.error(f"Error in demo analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Demo analysis failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)