from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from intelligent_analyzer import MedicalTextAnalyzer
import logging
import PyPDF2
import io

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="MediSense AI", description="Intelligent Medical Report Analysis API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the analyzer
analyzer = MedicalTextAnalyzer()

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
    return {"message": "MediSense AI - Medical Report Analysis API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "analyzer": "ready"}

@app.post("/analyze")
async def analyze_document(file: UploadFile = File(...)):
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
        
        # Analyze using your intelligent analyzer
        analysis_result = analyzer.analyze_medical_document(text_content, file.filename)
        
        logger.info("Analysis completed successfully")
        
        return JSONResponse(content={
            "success": True,
            "filename": file.filename,
            "analysis": analysis_result
        })
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error analyzing document: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/analyze-text")
async def analyze_text(request: dict):
    try:
        text_content = request.get("text", "")
        filename = request.get("filename", "text_input.txt")
        
        if not text_content.strip():
            raise HTTPException(status_code=400, detail="Text content is required")
        
        logger.info("Analyzing text input")
        
        # Analyze using your intelligent analyzer
        analysis_result = analyzer.analyze_medical_document(text_content, filename)
        
        logger.info("Text analysis completed successfully")
        
        return JSONResponse(content={
            "success": True,
            "filename": filename,
            "analysis": analysis_result
        })
        
    except Exception as e:
        logger.error(f"Error analyzing text: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Text analysis failed: {str(e)}")

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
        
        analysis_result = analyzer.analyze_medical_document(demo_text, "demo_medical_report.pdf")
        
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