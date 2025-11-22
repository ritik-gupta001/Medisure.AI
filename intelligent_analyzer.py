# Intelligent Medical Document Analyzer
import os
import re
import json
import base64
from typing import Dict, Any, List, Optional, Tuple
from datetime import datetime
import mimetypes
from io import BytesIO

# Text extraction libraries
try:
    import PyPDF2
    from PIL import Image
    import pytesseract
    HAS_OCR = True
except ImportError:
    HAS_OCR = False
    print("OCR libraries not available. Install PyPDF2, Pillow, and pytesseract for full functionality.")

class MedicalTextAnalyzer:
    """Intelligent analysis of medical document text"""
    
    def __init__(self):
        self.medical_terms = {
            # Lab values and normal ranges with detailed interpretation
            'cholesterol': {'normal': (0, 200), 'units': 'mg/dL', 'type': 'lipid', 'borderline': (200, 239), 'high': (240, 999)},
            'ldl': {'normal': (0, 100), 'units': 'mg/dL', 'type': 'lipid', 'borderline': (100, 129), 'high': (130, 999)},
            'hdl': {'normal': (40, 999), 'units': 'mg/dL', 'type': 'lipid', 'low': (0, 40), 'optimal': (60, 999)},
            'triglycerides': {'normal': (0, 150), 'units': 'mg/dL', 'type': 'lipid', 'borderline': (150, 199), 'high': (200, 999)},
            'glucose': {'normal': (70, 100), 'units': 'mg/dL', 'type': 'metabolic', 'prediabetes': (100, 125), 'diabetes': (126, 999)},
            'hba1c': {'normal': (0, 5.7), 'units': '%', 'type': 'diabetes', 'prediabetes': (5.7, 6.4), 'diabetes': (6.5, 999)},
            'blood_pressure_systolic': {'normal': (90, 120), 'units': 'mmHg', 'type': 'cardiovascular', 'elevated': (120, 129), 'stage1': (130, 139), 'stage2': (140, 999)},
            'blood_pressure_diastolic': {'normal': (60, 80), 'units': 'mmHg', 'type': 'cardiovascular', 'elevated': (80, 89), 'stage1': (80, 89), 'stage2': (90, 999)},
            'hemoglobin': {'normal': (12, 16), 'units': 'g/dL', 'type': 'hematology', 'anemia': (0, 12), 'high': (16, 999)},
            'white_blood_cells': {'normal': (4000, 11000), 'units': 'cells/μL', 'type': 'hematology', 'low': (0, 4000), 'high': (11000, 999999)},
            'platelets': {'normal': (150000, 450000), 'units': 'cells/μL', 'type': 'hematology', 'low': (0, 150000), 'high': (450000, 999999)},
            'creatinine': {'normal': (0.6, 1.2), 'units': 'mg/dL', 'type': 'kidney', 'elevated': (1.2, 1.5), 'high': (1.5, 999)},
            'bun': {'normal': (7, 20), 'units': 'mg/dL', 'type': 'kidney', 'elevated': (20, 30), 'high': (30, 999)},
            'alt': {'normal': (7, 56), 'units': 'U/L', 'type': 'liver', 'elevated': (56, 100), 'high': (100, 999)},
            'ast': {'normal': (10, 40), 'units': 'U/L', 'type': 'liver', 'elevated': (40, 80), 'high': (80, 999)},
            'bilirubin': {'normal': (0.2, 1.2), 'units': 'mg/dL', 'type': 'liver', 'elevated': (1.2, 2.0), 'high': (2.0, 999)},
            'tsh': {'normal': (0.4, 4.0), 'units': 'mIU/L', 'type': 'endocrine', 'low': (0, 0.4), 'high': (4.0, 999)},
            'vitamin_d': {'normal': (30, 100), 'units': 'ng/mL', 'type': 'nutritional', 'deficient': (0, 20), 'insufficient': (20, 30)},
            'psa': {'normal': (0, 4.0), 'units': 'ng/mL', 'type': 'tumor_marker', 'elevated': (4.0, 10.0), 'high': (10.0, 999)}
        }
        
        # Medical conditions and their associations
        self.medical_conditions = {
            'diabetes': {
                'indicators': ['diabetes', 'diabetic', 'dm', 'type 1', 'type 2', 'insulin', 'metformin'],
                'lab_markers': ['glucose', 'hba1c'],
                'complications': ['neuropathy', 'retinopathy', 'nephropathy', 'cardiovascular disease']
            },
            'hypertension': {
                'indicators': ['hypertension', 'high blood pressure', 'htn', 'bp'],
                'lab_markers': ['blood_pressure_systolic', 'blood_pressure_diastolic'],
                'complications': ['stroke', 'heart attack', 'kidney disease']
            },
            'hyperlipidemia': {
                'indicators': ['hyperlipidemia', 'high cholesterol', 'dyslipidemia'],
                'lab_markers': ['cholesterol', 'ldl', 'hdl', 'triglycerides'],
                'complications': ['atherosclerosis', 'coronary artery disease', 'stroke']
            },
            'anemia': {
                'indicators': ['anemia', 'iron deficiency', 'low hemoglobin'],
                'lab_markers': ['hemoglobin', 'hematocrit', 'iron'],
                'types': ['iron deficiency', 'chronic disease', 'b12 deficiency']
            },
            'liver_disease': {
                'indicators': ['liver disease', 'hepatitis', 'cirrhosis', 'fatty liver'],
                'lab_markers': ['alt', 'ast', 'bilirubin', 'albumin'],
                'causes': ['alcohol', 'viral hepatitis', 'fatty liver', 'medications']
            },
            'kidney_disease': {
                'indicators': ['kidney disease', 'renal failure', 'ckd', 'nephropathy'],
                'lab_markers': ['creatinine', 'bun', 'gfr'],
                'stages': ['stage 1', 'stage 2', 'stage 3', 'stage 4', 'stage 5']
            }
        }
        
        # Medication patterns and their implications
        self.medication_patterns = {
            'antidiabetic': ['metformin', 'insulin', 'glipizide', 'januvia', 'jardiance'],
            'antihypertensive': ['lisinopril', 'amlodipine', 'losartan', 'hydrochlorothiazide'],
            'statin': ['atorvastatin', 'simvastatin', 'rosuvastatin', 'lipitor', 'crestor'],
            'anticoagulant': ['warfarin', 'eliquis', 'xarelto', 'coumadin'],
            'thyroid': ['levothyroxine', 'synthroid', 'methimazole']
        }
        
        self.severity_keywords = {
            'critical': ['critical', 'severe', 'acute', 'emergency', 'urgent', 'high risk'],
            'moderate': ['moderate', 'elevated', 'abnormal', 'concerning', 'borderline'],
            'mild': ['mild', 'slight', 'minor', 'borderline low', 'minimal'],
            'normal': ['normal', 'within limits', 'unremarkable', 'stable', 'good']
        }
        
        self.report_types = {
            'lab_report': ['laboratory', 'blood test', 'lab results', 'chemistry panel', 'cbc'],
            'imaging': ['x-ray', 'ct scan', 'mri', 'ultrasound', 'mammogram', 'radiologic'],
            'cardiology': ['ecg', 'ekg', 'echo', 'stress test', 'cardiac', 'heart'],
            'pathology': ['biopsy', 'pathology', 'histology', 'cytology', 'tumor'],
            'consultation': ['consultation', 'assessment', 'history', 'examination', 'clinical']
        }

    def extract_text_from_file(self, file_content: bytes, filename: str) -> str:
        """Extract text from various file formats"""
        file_ext = os.path.splitext(filename.lower())[1]
        text = ""
        
        try:
            if file_ext == '.pdf':
                text = self._extract_from_pdf(file_content)
            elif file_ext in ['.png', '.jpg', '.jpeg', '.tiff', '.bmp']:
                text = self._extract_from_image(file_content)
            elif file_ext in ['.txt', '.rtf']:
                text = file_content.decode('utf-8', errors='ignore')
            else:
                # Try to decode as text
                text = file_content.decode('utf-8', errors='ignore')
                
        except Exception as e:
            print(f"Text extraction error: {e}")
            text = file_content.decode('utf-8', errors='ignore')
            
        return text

    def _extract_from_pdf(self, file_content: bytes) -> str:
        """Extract text from PDF"""
        if not HAS_OCR:
            return "PDF text extraction requires PyPDF2 library"
            
        try:
            pdf_file = BytesIO(file_content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            text = ""
            
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
                
            return text
        except Exception as e:
            return f"PDF extraction error: {e}"

    def _extract_from_image(self, file_content: bytes) -> str:
        """Extract text from image using OCR"""
        if not HAS_OCR:
            return "Image text extraction requires pytesseract and Pillow libraries"
            
        try:
            image = Image.open(BytesIO(file_content))
            text = pytesseract.image_to_string(image)
            return text
        except Exception as e:
            return f"OCR extraction error: {e}"

    def analyze_medical_document(self, text: str, filename: str = "") -> Dict[str, Any]:
        """Perform intelligent analysis of medical document text"""
        
        # Clean and prepare text
        text = self._clean_text(text)
        
        # Detect report type
        report_type = self._detect_report_type(text)
        
        # Extract medical values
        lab_values = self._extract_lab_values(text)
        
        # Extract patient demographics
        demographics = self._extract_demographics(text)
        
        # Analyze findings
        findings = self._analyze_findings(text, lab_values)
        
        # Calculate risk assessment
        risk_assessment = self._calculate_risk_assessment(lab_values, findings)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(lab_values, findings, risk_assessment)
        
        # Generate patient-friendly summary
        patient_summary = self._generate_patient_summary(demographics, lab_values, findings, recommendations)
        
        # Generate doctor summary
        doctor_summary = self._generate_doctor_summary(demographics, lab_values, findings, risk_assessment, report_type)
        
        return {
            "patient_summary": patient_summary,
            "doctor_summary": doctor_summary,
            "report_type": report_type,
            "extracted_values": lab_values,
            "analysis_confidence": self._calculate_confidence(text, lab_values),
            "processing_metadata": {
                "text_length": len(text),
                "filename": filename,
                "timestamp": datetime.utcnow().isoformat()
            }
        }

    def _clean_text(self, text: str) -> str:
        """Clean and normalize text"""
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove special characters but keep medical notation
        text = re.sub(r'[^\w\s\.\,\:\;\-\(\)\/\%\<\>]', ' ', text)
        return text.strip()

    def _detect_report_type(self, text: str) -> str:
        """Detect the type of medical report"""
        text_lower = text.lower()
        
        for report_type, keywords in self.report_types.items():
            if any(keyword in text_lower for keyword in keywords):
                return report_type
                
        return "general"

    def _extract_lab_values(self, text: str) -> Dict[str, Any]:
        """Extract laboratory values and measurements"""
        lab_values = {}
        
        # Common patterns for medical values
        patterns = {
            'cholesterol': r'(?:total\s*)?cholesterol\s*:?\s*(\d+\.?\d*)\s*(mg/dl|mg%)',
            'ldl': r'ldl\s*:?\s*(\d+\.?\d*)\s*(mg/dl|mg%)',
            'hdl': r'hdl\s*:?\s*(\d+\.?\d*)\s*(mg/dl|mg%)',
            'triglycerides': r'triglycerides?\s*:?\s*(\d+\.?\d*)\s*(mg/dl|mg%)',
            'glucose': r'glucose\s*:?\s*(\d+\.?\d*)\s*(mg/dl|mg%)',
            'hba1c': r'hba1c\s*:?\s*(\d+\.?\d*)\s*%?',
            'blood_pressure': r'(?:bp|blood\s*pressure)\s*:?\s*(\d+)\s*/\s*(\d+)',
            'hemoglobin': r'(?:hgb|hemoglobin)\s*:?\s*(\d+\.?\d*)\s*(g/dl|g%)',
            'creatinine': r'creatinine\s*:?\s*(\d+\.?\d*)\s*(mg/dl|mg%)',
            'alt': r'alt\s*:?\s*(\d+\.?\d*)\s*(u/l|iu/l)',
            'ast': r'ast\s*:?\s*(\d+\.?\d*)\s*(u/l|iu/l)'
        }
        
        text_lower = text.lower()
        
        for test_name, pattern in patterns.items():
            matches = re.findall(pattern, text_lower, re.IGNORECASE)
            if matches:
                if test_name == 'blood_pressure':
                    lab_values['blood_pressure_systolic'] = {'value': float(matches[0][0]), 'unit': 'mmHg'}
                    lab_values['blood_pressure_diastolic'] = {'value': float(matches[0][1]), 'unit': 'mmHg'}
                else:
                    value = float(matches[0][0])
                    unit = matches[0][1] if len(matches[0]) > 1 else ''
                    lab_values[test_name] = {'value': value, 'unit': unit}
        
        return lab_values

    def _extract_demographics(self, text: str) -> Dict[str, Any]:
        """Extract patient demographic information"""
        demographics = {}
        
        # Age pattern
        age_match = re.search(r'age\s*:?\s*(\d+)', text, re.IGNORECASE)
        if age_match:
            demographics['age'] = int(age_match.group(1))
        
        # Gender pattern
        gender_match = re.search(r'(?:gender|sex)\s*:?\s*(male|female|m|f)', text, re.IGNORECASE)
        if gender_match:
            gender = gender_match.group(1).lower()
            demographics['gender'] = 'Male' if gender in ['male', 'm'] else 'Female'
        
        # Patient name pattern
        name_match = re.search(r'patient\s*(?:name)?\s*:?\s*([A-Za-z\s]+)', text, re.IGNORECASE)
        if name_match:
            demographics['patient_name'] = name_match.group(1).strip()
        
        # Date pattern
        date_match = re.search(r'(?:date|report\s*date)\s*:?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})', text, re.IGNORECASE)
        if date_match:
            demographics['report_date'] = date_match.group(1)
            
        return demographics

    def _analyze_findings(self, text: str, lab_values: Dict) -> List[Dict[str, Any]]:
        """Analyze medical findings from text and lab values"""
        findings = []
        
        # Analyze lab values against normal ranges
        for test_name, result in lab_values.items():
            if test_name in self.medical_terms:
                normal_range = self.medical_terms[test_name]['normal']
                value = result['value']
                
                if value < normal_range[0]:
                    status = 'Low'
                    severity = 'mild'
                elif value > normal_range[1]:
                    status = 'High'
                    severity = 'moderate' if value <= normal_range[1] * 1.2 else 'critical'
                else:
                    status = 'Normal'
                    severity = 'normal'
                
                findings.append({
                    'test': test_name.replace('_', ' ').title(),
                    'value': f"{value} {result.get('unit', '')}",
                    'status': status,
                    'severity': severity,
                    'reference_range': f"{normal_range[0]}-{normal_range[1]} {self.medical_terms[test_name]['units']}"
                })
        
        # Look for textual findings
        text_lower = text.lower()
        for severity_level, keywords in self.severity_keywords.items():
            for keyword in keywords:
                if keyword in text_lower:
                    # Extract context around the keyword
                    context = self._extract_context(text, keyword)
                    if context and len(context) > 20:
                        findings.append({
                            'finding': context,
                            'severity': severity_level,
                            'source': 'text_analysis'
                        })
        
        return findings

    def _extract_context(self, text: str, keyword: str, window: int = 50) -> str:
        """Extract context around a keyword"""
        text_lower = text.lower()
        keyword_lower = keyword.lower()
        
        index = text_lower.find(keyword_lower)
        if index == -1:
            return ""
        
        start = max(0, index - window)
        end = min(len(text), index + len(keyword) + window)
        
        return text[start:end].strip()

    def _calculate_risk_assessment(self, lab_values: Dict, findings: List) -> Dict[str, Any]:
        """Calculate overall risk assessment with dynamic percentage calculation"""
        risk_factors = []
        overall_score = 0
        
        # Assess cardiovascular risk
        cv_risk = self._assess_cardiovascular_risk(lab_values)
        if cv_risk['score'] > 0:
            risk_factors.append(cv_risk)
            overall_score += cv_risk['score']
        
        # Assess diabetes risk
        dm_risk = self._assess_diabetes_risk(lab_values)
        if dm_risk['score'] > 0:
            risk_factors.append(dm_risk)
            overall_score += dm_risk['score']
        
        # Count severity levels from findings
        severity_counts = {'critical': 0, 'moderate': 0, 'mild': 0, 'normal': 0}
        for finding in findings:
            severity = finding.get('severity', 'normal')
            if severity in severity_counts:
                severity_counts[severity] += 1
        
        # Calculate dynamic risk percentage based on multiple factors
        risk_percentage = self._calculate_dynamic_risk_percentage(overall_score, severity_counts, len(findings))
        
        # Calculate overall risk level
        if overall_score >= 8 or severity_counts['critical'] > 0:
            risk_level = 'High'
        elif overall_score >= 5 or severity_counts['moderate'] > 2:
            risk_level = 'Moderate'
        elif overall_score >= 2 or severity_counts['mild'] > 1:
            risk_level = 'Low-Moderate'
        else:
            risk_level = 'Low'
        
        return {
            'overall_risk': risk_level,
            'risk_score': overall_score,
            'risk_percentage': risk_percentage,
            'risk_factors': risk_factors,
            'severity_distribution': severity_counts
        }

    def _assess_cardiovascular_risk(self, lab_values: Dict) -> Dict[str, Any]:
        """Assess cardiovascular risk factors"""
        score = 0
        factors = []
        
        # Check cholesterol
        if 'cholesterol' in lab_values and lab_values['cholesterol']['value'] > 240:
            score += 3
            factors.append("High total cholesterol")
        elif 'cholesterol' in lab_values and lab_values['cholesterol']['value'] > 200:
            score += 2
            factors.append("Borderline high cholesterol")
        
        # Check LDL
        if 'ldl' in lab_values and lab_values['ldl']['value'] > 160:
            score += 3
            factors.append("High LDL cholesterol")
        elif 'ldl' in lab_values and lab_values['ldl']['value'] > 130:
            score += 2
            factors.append("Borderline high LDL")
        
        # Check HDL (lower is worse)
        if 'hdl' in lab_values and lab_values['hdl']['value'] < 40:
            score += 2
            factors.append("Low HDL cholesterol")
        
        # Check blood pressure
        if ('blood_pressure_systolic' in lab_values and lab_values['blood_pressure_systolic']['value'] > 140) or \
           ('blood_pressure_diastolic' in lab_values and lab_values['blood_pressure_diastolic']['value'] > 90):
            score += 3
            factors.append("High blood pressure")
        
        return {
            'category': 'Cardiovascular',
            'score': score,
            'factors': factors,
            'recommendation': 'Consider cardiology consultation' if score >= 5 else 'Monitor cardiovascular health'
        }

    def _assess_diabetes_risk(self, lab_values: Dict) -> Dict[str, Any]:
        """Assess diabetes risk factors"""
        score = 0
        factors = []
        
        # Check glucose
        if 'glucose' in lab_values:
            glucose = lab_values['glucose']['value']
            if glucose >= 126:
                score += 4
                factors.append("Diabetic range glucose")
            elif glucose >= 100:
                score += 2
                factors.append("Prediabetic glucose")
        
        # Check HbA1c
        if 'hba1c' in lab_values:
            hba1c = lab_values['hba1c']['value']
            if hba1c >= 6.5:
                score += 4
                factors.append("Diabetic range HbA1c")
            elif hba1c >= 5.7:
                score += 2
                factors.append("Prediabetic HbA1c")
        
        return {
            'category': 'Diabetes',
            'score': score,
            'factors': factors,
            'recommendation': 'Endocrinology referral recommended' if score >= 4 else 'Monitor glucose levels'
        }

    def _calculate_dynamic_risk_percentage(self, overall_score: int, severity_counts: Dict, total_findings: int) -> int:
        """Calculate dynamic risk percentage based on multiple health factors"""
        
        # Base percentage calculation
        base_percentage = min(overall_score * 7, 100)  # Each score point = 7%
        
        # Adjust based on severity distribution
        severity_adjustment = 0
        severity_adjustment += severity_counts.get('critical', 0) * 25  # Critical findings add 25% each
        severity_adjustment += severity_counts.get('moderate', 0) * 10  # Moderate findings add 10% each
        severity_adjustment += severity_counts.get('mild', 0) * 3      # Mild findings add 3% each
        
        # Factor in the number of total findings
        if total_findings > 5:
            finding_adjustment = min((total_findings - 5) * 2, 15)  # Cap at 15% additional
        else:
            finding_adjustment = 0
        
        # Calculate final percentage
        final_percentage = base_percentage + severity_adjustment + finding_adjustment
        
        # Ensure minimum meaningful variance and cap at 95%
        if final_percentage < 5:
            final_percentage = max(5, overall_score * 3)  # Minimum 5% or 3% per score point
        
        final_percentage = min(final_percentage, 95)  # Cap at 95% max
        
        return final_percentage

    def _generate_recommendations(self, lab_values: Dict, findings: List, risk_assessment: Dict) -> List[str]:
        """Generate personalized recommendations"""
        recommendations = []
        
        # Risk-based recommendations
        if risk_assessment['overall_risk'] in ['High', 'Moderate']:
            recommendations.append("Schedule follow-up appointment with your physician within 2-4 weeks")
        
        # Specific lab value recommendations
        for test_name, result in lab_values.items():
            if test_name == 'cholesterol' and result['value'] > 200:
                recommendations.append("Consider dietary changes to reduce cholesterol intake")
                if result['value'] > 240:
                    recommendations.append("Discuss cholesterol-lowering medication with your doctor")
            
            elif test_name == 'glucose' and result['value'] > 100:
                recommendations.append("Monitor blood sugar levels and consider dietary modifications")
                if result['value'] >= 126:
                    recommendations.append("Consult with an endocrinologist for diabetes management")
            
            elif test_name in ['blood_pressure_systolic', 'blood_pressure_diastolic']:
                if result['value'] > (140 if 'systolic' in test_name else 90):
                    recommendations.append("Monitor blood pressure regularly and consider lifestyle modifications")
        
        # General recommendations
        recommendations.extend([
            "Maintain a balanced diet rich in fruits and vegetables",
            "Engage in regular physical activity as approved by your healthcare provider",
            "Keep all scheduled medical appointments"
        ])
        
        return recommendations

    def _generate_patient_summary(self, demographics: Dict, lab_values: Dict, findings: List, recommendations: List) -> Dict[str, Any]:
        """Generate comprehensive patient-friendly summary with detailed analysis"""
        
        # Create detailed findings analysis
        key_findings = []
        detailed_analysis = []
        
        # Analyze each lab value with specific medical interpretation
        for test_name, result in lab_values.items():
            if test_name in self.medical_terms:
                analysis = self._analyze_single_lab_value(test_name, result)
                if analysis:
                    key_findings.append(analysis['summary'])
                    detailed_analysis.append(analysis)
        
        # Detect medical conditions from patterns
        detected_conditions = self._detect_medical_conditions(lab_values, findings)
        for condition in detected_conditions:
            key_findings.append(f"Analysis suggests possible {condition['name']}: {condition['explanation']}")
        
        # Generate risk stratification
        risk_analysis = self._generate_comprehensive_risk_analysis(lab_values, detected_conditions)
        
        # Generate specific, actionable recommendations
        smart_recommendations = self._generate_intelligent_recommendations(lab_values, detected_conditions, risk_analysis)
        
        # If no specific findings, provide meaningful general analysis
        if not key_findings:
            key_findings = self._generate_general_analysis_insights(demographics, lab_values)
        
        return {
            "demographics": demographics,
            "key_findings": key_findings[:8],  # Top 8 most important findings
            "detailed_analysis": detailed_analysis,
            "detected_conditions": detected_conditions,
            "risk_analysis": risk_analysis,
            "recommendations": smart_recommendations[:6],  # Top 6 recommendations
            "next_steps": self._generate_specific_next_steps(detected_conditions, risk_analysis),
            "lifestyle_modifications": self._generate_lifestyle_recommendations(detected_conditions, lab_values),
            "monitoring_plan": self._generate_monitoring_plan(detected_conditions, lab_values)
        }
    
    def _analyze_single_lab_value(self, test_name: str, result: Dict) -> Optional[Dict]:
        """Provide detailed analysis of a single lab value"""
        if test_name not in self.medical_terms:
            return None
            
        term_info = self.medical_terms[test_name]
        value = result['value']
        
        # Determine status with detailed categorization
        status = 'Normal'
        severity = 'normal'
        explanation = ''
        clinical_significance = ''
        
        if 'diabetes' in term_info.get('type', ''):
            if test_name == 'glucose':
                if value >= 126:
                    status, severity, explanation = 'Diabetic Range', 'high', f'Fasting glucose of {value} mg/dL indicates diabetes (≥126 mg/dL)'
                    clinical_significance = 'This level strongly suggests diabetes mellitus. Immediate medical attention and diabetes management are required.'
                elif value >= 100:
                    status, severity, explanation = 'Prediabetic Range', 'moderate', f'Fasting glucose of {value} mg/dL indicates prediabetes (100-125 mg/dL)'
                    clinical_significance = 'This level indicates impaired glucose tolerance, which is a precursor to diabetes. Lifestyle changes can help prevent progression.'
                else:
                    explanation = f'Fasting glucose of {value} mg/dL is within normal range (70-99 mg/dL)'
                    clinical_significance = 'Glucose metabolism appears normal. Continue healthy lifestyle habits.'
                    
            elif test_name == 'hba1c':
                if value >= 6.5:
                    status, severity, explanation = 'Diabetic Range', 'high', f'HbA1c of {value}% indicates diabetes (≥6.5%)'
                    clinical_significance = 'This reflects average blood sugar over 2-3 months and confirms diabetes diagnosis.'
                elif value >= 5.7:
                    status, severity, explanation = 'Prediabetic Range', 'moderate', f'HbA1c of {value}% indicates prediabetes (5.7-6.4%)'
                    clinical_significance = 'This indicates increased risk for developing diabetes within 5 years.'
                else:
                    explanation = f'HbA1c of {value}% is optimal (<5.7%)'
                    clinical_significance = 'Excellent long-term glucose control.'
        
        elif 'lipid' in term_info.get('type', ''):
            if test_name == 'cholesterol':
                if value >= 240:
                    status, severity, explanation = 'High', 'high', f'Total cholesterol of {value} mg/dL is high (≥240 mg/dL)'
                    clinical_significance = 'Significantly increases risk of heart disease and stroke. Medical intervention likely needed.'
                elif value >= 200:
                    status, severity, explanation = 'Borderline High', 'moderate', f'Total cholesterol of {value} mg/dL is borderline high (200-239 mg/dL)'
                    clinical_significance = 'Moderate cardiovascular risk. Dietary changes and monitoring recommended.'
                else:
                    explanation = f'Total cholesterol of {value} mg/dL is desirable (<200 mg/dL)'
                    clinical_significance = 'Good cardiovascular risk profile regarding cholesterol.'
                    
            elif test_name == 'ldl':
                if value >= 160:
                    status, severity, explanation = 'High', 'high', f'LDL cholesterol of {value} mg/dL is high (≥160 mg/dL)'
                    clinical_significance = '"Bad" cholesterol is significantly elevated, substantially increasing heart disease risk.'
                elif value >= 130:
                    status, severity, explanation = 'Borderline High', 'moderate', f'LDL cholesterol of {value} mg/dL is borderline high (130-159 mg/dL)'
                    clinical_significance = 'Moderately elevated "bad" cholesterol requires attention to prevent cardiovascular disease.'
                elif value >= 100:
                    status, severity, explanation = 'Near Optimal', 'mild', f'LDL cholesterol of {value} mg/dL is near optimal (100-129 mg/dL)'
                    clinical_significance = 'Slightly elevated but manageable with lifestyle modifications.'
                else:
                    explanation = f'LDL cholesterol of {value} mg/dL is optimal (<100 mg/dL)'
                    clinical_significance = 'Excellent "bad" cholesterol level, protective against heart disease.'
                    
            elif test_name == 'hdl':
                if value < 40:
                    status, severity, explanation = 'Low', 'moderate', f'HDL cholesterol of {value} mg/dL is low (<40 mg/dL for men, <50 mg/dL for women)'
                    clinical_significance = '"Good" cholesterol is too low, reducing protection against heart disease.'
                elif value >= 60:
                    status, severity, explanation = 'High (Protective)', 'optimal', f'HDL cholesterol of {value} mg/dL is high (≥60 mg/dL)'
                    clinical_significance = 'Excellent "good" cholesterol level, strongly protective against heart disease.'
                else:
                    explanation = f'HDL cholesterol of {value} mg/dL is acceptable'
                    clinical_significance = 'Adequate "good" cholesterol level.'
        
        elif 'cardiovascular' in term_info.get('type', ''):
            if test_name == 'blood_pressure_systolic':
                if value >= 140:
                    status, severity, explanation = 'Stage 2 Hypertension', 'high', f'Systolic BP of {value} mmHg indicates Stage 2 hypertension (≥140 mmHg)'
                    clinical_significance = 'High blood pressure significantly increases risk of heart attack, stroke, and kidney disease. Medication likely needed.'
                elif value >= 130:
                    status, severity, explanation = 'Stage 1 Hypertension', 'moderate', f'Systolic BP of {value} mmHg indicates Stage 1 hypertension (130-139 mmHg)'
                    clinical_significance = 'Elevated blood pressure increases cardiovascular risk. Lifestyle changes and possible medication needed.'
                elif value >= 120:
                    status, severity, explanation = 'Elevated', 'mild', f'Systolic BP of {value} mmHg is elevated (120-129 mmHg)'
                    clinical_significance = 'Blood pressure is higher than optimal. Lifestyle modifications can help prevent progression to hypertension.'
                else:
                    explanation = f'Systolic BP of {value} mmHg is normal (<120 mmHg)'
                    clinical_significance = 'Excellent blood pressure reading, protective against cardiovascular disease.'
        
        if not explanation:  # Generic analysis for other values
            normal_range = term_info['normal']
            if value < normal_range[0]:
                status, severity = 'Low', 'mild'
                explanation = f'{test_name.replace("_", " ").title()} of {value} {result.get("unit", term_info["units"])} is below normal range'
                clinical_significance = f'Low {test_name.replace("_", " ")} may indicate underlying medical condition requiring evaluation.'
            elif value > normal_range[1]:
                status, severity = 'High', 'moderate'
                explanation = f'{test_name.replace("_", " ").title()} of {value} {result.get("unit", term_info["units"])} is above normal range'
                clinical_significance = f'Elevated {test_name.replace("_", " ")} may indicate underlying medical condition requiring evaluation.'
            else:
                explanation = f'{test_name.replace("_", " ").title()} of {value} {result.get("unit", term_info["units"])} is within normal range'
                clinical_significance = f'Normal {test_name.replace("_", " ")} level indicates good function in this area.'
        
        return {
            'test': test_name.replace('_', ' ').title(),
            'value': f"{value} {result.get('unit', term_info['units'])}",
            'status': status,
            'severity': severity,
            'summary': explanation,
            'clinical_significance': clinical_significance,
            'reference_range': f"{term_info['normal'][0]}-{term_info['normal'][1]} {term_info['units']}"
        }
    
    def _detect_medical_conditions(self, lab_values: Dict, findings: List) -> List[Dict]:
        """Detect medical conditions based on lab patterns and clinical findings"""
        detected_conditions = []
        
        # Check for diabetes
        diabetes_indicators = 0
        diabetes_evidence = []
        if 'glucose' in lab_values and lab_values['glucose']['value'] >= 126:
            diabetes_indicators += 2
            diabetes_evidence.append(f"Fasting glucose {lab_values['glucose']['value']} mg/dL (diabetic range)")
        elif 'glucose' in lab_values and lab_values['glucose']['value'] >= 100:
            diabetes_indicators += 1
            diabetes_evidence.append(f"Fasting glucose {lab_values['glucose']['value']} mg/dL (prediabetic range)")
            
        if 'hba1c' in lab_values and lab_values['hba1c']['value'] >= 6.5:
            diabetes_indicators += 2
            diabetes_evidence.append(f"HbA1c {lab_values['hba1c']['value']}% (diabetic range)")
        elif 'hba1c' in lab_values and lab_values['hba1c']['value'] >= 5.7:
            diabetes_indicators += 1
            diabetes_evidence.append(f"HbA1c {lab_values['hba1c']['value']}% (prediabetic range)")
        
        if diabetes_indicators >= 2:
            detected_conditions.append({
                'name': 'Diabetes Mellitus',
                'confidence': 'High',
                'evidence': diabetes_evidence,
                'explanation': 'Multiple lab values indicate diabetes. This is a chronic condition requiring ongoing medical management.',
                'complications_risk': 'High risk for cardiovascular disease, kidney disease, nerve damage, and eye problems if not well controlled.',
                'management': 'Requires comprehensive diabetes management including medication, diet modification, regular monitoring, and lifestyle changes.'
            })
        elif diabetes_indicators >= 1:
            detected_conditions.append({
                'name': 'Prediabetes',
                'confidence': 'Moderate',
                'evidence': diabetes_evidence,
                'explanation': 'Lab values suggest impaired glucose metabolism. This is a reversible condition with proper intervention.',
                'complications_risk': 'Increased risk of developing Type 2 diabetes within 5-10 years without intervention.',
                'management': 'Lifestyle modifications including weight loss, increased physical activity, and dietary changes can prevent progression to diabetes.'
            })
        
        # Check for cardiovascular risk/hypertension
        cv_risk = 0
        cv_evidence = []
        if 'blood_pressure_systolic' in lab_values and lab_values['blood_pressure_systolic']['value'] >= 130:
            cv_risk += 1
            cv_evidence.append(f"Systolic BP {lab_values['blood_pressure_systolic']['value']} mmHg")
        if 'cholesterol' in lab_values and lab_values['cholesterol']['value'] >= 200:
            cv_risk += 1
            cv_evidence.append(f"Total cholesterol {lab_values['cholesterol']['value']} mg/dL")
        if 'ldl' in lab_values and lab_values['ldl']['value'] >= 130:
            cv_risk += 1
            cv_evidence.append(f"LDL cholesterol {lab_values['ldl']['value']} mg/dL")
        if 'hdl' in lab_values and lab_values['hdl']['value'] < 40:
            cv_risk += 1
            cv_evidence.append(f"HDL cholesterol {lab_values['hdl']['value']} mg/dL (low)")
            
        if cv_risk >= 2:
            detected_conditions.append({
                'name': 'Cardiovascular Risk Factors',
                'confidence': 'High',
                'evidence': cv_evidence,
                'explanation': 'Multiple cardiovascular risk factors are present, significantly increasing the risk of heart disease and stroke.',
                'complications_risk': 'High risk for heart attack, stroke, peripheral artery disease, and other cardiovascular events.',
                'management': 'Requires aggressive risk factor modification including medication management, lifestyle changes, and regular monitoring.'
            })
        elif cv_risk >= 1:
            detected_conditions.append({
                'name': 'Mild Cardiovascular Risk',
                'confidence': 'Moderate',
                'evidence': cv_evidence,
                'explanation': 'Some cardiovascular risk factors are present that should be addressed.',
                'complications_risk': 'Moderately increased risk for cardiovascular events.',
                'management': 'Lifestyle modifications and possibly medication to reduce cardiovascular risk.'
            })
        
        # Check for kidney disease
        kidney_risk = 0
        kidney_evidence = []
        if 'creatinine' in lab_values and lab_values['creatinine']['value'] >= 1.5:
            kidney_risk += 2
            kidney_evidence.append(f"Creatinine {lab_values['creatinine']['value']} mg/dL (elevated)")
        elif 'creatinine' in lab_values and lab_values['creatinine']['value'] >= 1.2:
            kidney_risk += 1
            kidney_evidence.append(f"Creatinine {lab_values['creatinine']['value']} mg/dL (mildly elevated)")
            
        if 'bun' in lab_values and lab_values['bun']['value'] >= 30:
            kidney_risk += 1
            kidney_evidence.append(f"BUN {lab_values['bun']['value']} mg/dL (elevated)")
        
        if kidney_risk >= 2:
            detected_conditions.append({
                'name': 'Possible Kidney Disease',
                'confidence': 'Moderate',
                'evidence': kidney_evidence,
                'explanation': 'Lab values suggest possible kidney function impairment requiring further evaluation.',
                'complications_risk': 'Progressive kidney disease can lead to chronic kidney disease and eventual need for dialysis.',
                'management': 'Requires nephrology evaluation, monitoring of kidney function, and management of underlying causes.'
            })
        
        return detected_conditions
    
    def _generate_comprehensive_risk_analysis(self, lab_values: Dict, conditions: List) -> Dict[str, Any]:
        """Generate comprehensive risk analysis"""
        overall_risk_score = 0
        risk_factors = []
        
        # Calculate risk based on detected conditions
        for condition in conditions:
            if condition['confidence'] == 'High':
                if 'Diabetes' in condition['name']:
                    overall_risk_score += 4
                    risk_factors.append("Diabetes significantly increases cardiovascular and complications risk")
                elif 'Cardiovascular' in condition['name']:
                    overall_risk_score += 3
                    risk_factors.append("Multiple cardiovascular risk factors present")
                elif 'Kidney' in condition['name']:
                    overall_risk_score += 2
                    risk_factors.append("Possible kidney function impairment")
            elif condition['confidence'] == 'Moderate':
                overall_risk_score += 1
                risk_factors.append(f"Moderate risk for {condition['name'].lower()}")
        
        # Calculate dynamic risk percentage
        risk_percentage = self._calculate_legacy_risk_percentage(overall_risk_score, len(conditions), len(risk_factors))
        
        # Determine overall risk level
        if overall_risk_score >= 6:
            risk_level = 'High'
            risk_description = 'Multiple serious medical conditions detected requiring immediate medical attention and aggressive management.'
        elif overall_risk_score >= 4:
            risk_level = 'Moderate-High'
            risk_description = 'Significant medical conditions present that require prompt medical evaluation and management.'
        elif overall_risk_score >= 2:
            risk_level = 'Moderate'
            risk_description = 'Some medical concerns identified that warrant medical evaluation and monitoring.'
        elif overall_risk_score >= 1:
            risk_level = 'Low-Moderate'
            risk_description = 'Minor medical concerns that should be discussed with healthcare provider.'
        else:
            risk_level = 'Low'
            risk_description = 'Lab values appear generally within acceptable ranges.'
        
        return {
            'overall_risk': risk_level,
            'risk_score': overall_risk_score,
            'risk_percentage': risk_percentage,
            'risk_description': risk_description,
            'risk_factors': risk_factors,
            'urgency': 'Urgent' if overall_risk_score >= 6 else 'Prompt' if overall_risk_score >= 4 else 'Routine'
        }

    def _calculate_legacy_risk_percentage(self, risk_score: int, condition_count: int, risk_factor_count: int) -> int:
        """Calculate dynamic risk percentage for legacy analysis"""
        
        # Base calculation
        base_percentage = min(risk_score * 8, 80)  # Each score point = 8%
        
        # Adjust based on number of conditions
        condition_adjustment = min(condition_count * 5, 15)  # Max 15% from conditions
        
        # Adjust based on risk factors
        factor_adjustment = min(risk_factor_count * 3, 10)  # Max 10% from risk factors
        
        # Calculate final percentage
        final_percentage = base_percentage + condition_adjustment + factor_adjustment
        
        # Ensure minimum variance and realistic range
        if final_percentage < 10:
            final_percentage = max(10, risk_score * 5)
        
        final_percentage = min(final_percentage, 90)  # Cap at 90%
        
        return final_percentage
    
    def _generate_intelligent_recommendations(self, lab_values: Dict, conditions: List, risk_analysis: Dict) -> List[str]:
        """Generate specific, actionable recommendations based on analysis"""
        recommendations = []
        
        # Condition-specific recommendations
        for condition in conditions:
            if 'Diabetes' in condition['name']:
                if condition['confidence'] == 'High':
                    recommendations.extend([
                        "Schedule appointment with endocrinologist or diabetes specialist within 1-2 weeks",
                        "Begin blood glucose monitoring as directed by healthcare provider",
                        "Start diabetes-friendly diet plan with carbohydrate counting",
                        "Discuss diabetes medications (metformin, insulin) with doctor"
                    ])
                else:  # Prediabetes
                    recommendations.extend([
                        "Implement diabetes prevention program - aim to lose 5-10% of body weight",
                        "Increase physical activity to 150 minutes moderate exercise per week",
                        "Adopt low-glycemic diet rich in whole grains, vegetables, and lean proteins",
                        "Monitor fasting glucose every 3-6 months"
                    ])
            
            elif 'Cardiovascular' in condition['name']:
                recommendations.extend([
                    "Schedule cardiology consultation for comprehensive risk assessment",
                    "Consider statin therapy discussion with physician for cholesterol management",
                    "Implement DASH diet (low sodium, rich in fruits/vegetables)",
                    "Begin regular aerobic exercise program as approved by doctor"
                ])
                
            elif 'Kidney' in condition['name']:
                recommendations.extend([
                    "Schedule nephrology consultation for kidney function evaluation",
                    "Ensure adequate hydration unless otherwise directed",
                    "Monitor and control blood pressure if elevated",
                    "Review all medications with doctor to avoid kidney-toxic drugs"
                ])
        
        # Risk-based recommendations
        if risk_analysis['overall_risk'] in ['High', 'Moderate-High']:
            recommendations.extend([
                "Schedule comprehensive medical evaluation within 1-2 weeks",
                "Consider consultation with relevant specialists based on conditions identified",
                "Implement aggressive lifestyle modifications immediately"
            ])
        
        # General health optimization
        recommendations.extend([
            "Maintain regular sleep schedule (7-9 hours per night)",
            "Stay well-hydrated (8-10 glasses of water daily)",
            "Consider stress management techniques (meditation, yoga)",
            "Schedule regular preventive care appointments"
        ])
        
        return recommendations
    
    def _generate_specific_next_steps(self, conditions: List, risk_analysis: Dict) -> List[str]:
        """Generate specific next steps based on analysis"""
        next_steps = []
        
        if risk_analysis['urgency'] == 'Urgent':
            next_steps.append("URGENT: Contact your healthcare provider immediately or visit emergency room if symptoms present")
            
        if risk_analysis['urgency'] in ['Urgent', 'Prompt']:
            next_steps.append("Schedule follow-up appointment with your primary care physician within 1-2 weeks")
        else:
            next_steps.append("Discuss these results at your next routine medical appointment")
        
        # Condition-specific next steps
        for condition in conditions:
            if condition['confidence'] == 'High':
                if 'Diabetes' in condition['name']:
                    next_steps.append("Request referral to certified diabetes educator for comprehensive diabetes management")
                elif 'Cardiovascular' in condition['name']:
                    next_steps.append("Request cardiovascular risk assessment and consider stress testing")
        
        next_steps.extend([
            "Bring this analysis report to your healthcare provider for review",
            "Ask your doctor about any values or conditions you don't understand",
            "Request copy of all lab results for your personal health records"
        ])
        
        return next_steps
    
    def _generate_lifestyle_recommendations(self, conditions: List, lab_values: Dict) -> List[str]:
        """Generate targeted lifestyle recommendations"""
        lifestyle_recs = []
        
        # Diabetes/prediabetes lifestyle
        diabetes_detected = any('Diabetes' in c['name'] or 'Prediabetes' in c['name'] for c in conditions)
        if diabetes_detected:
            lifestyle_recs.extend([
                "Follow diabetes-friendly eating plan with consistent meal timing",
                "Monitor carbohydrate intake and learn carb counting",
                "Engage in post-meal walking to help control blood sugar spikes"
            ])
        
        # Cardiovascular lifestyle
        cv_detected = any('Cardiovascular' in c['name'] for c in conditions)
        if cv_detected:
            lifestyle_recs.extend([
                "Adopt Mediterranean-style diet rich in omega-3 fatty acids",
                "Limit sodium intake to less than 2,300mg per day (ideally 1,500mg)",
                "Include 30 minutes of aerobic activity 5 days per week"
            ])
        
        # General healthy lifestyle
        lifestyle_recs.extend([
            "Maintain healthy weight through balanced nutrition and regular exercise",
            "Avoid tobacco use and limit alcohol consumption",
            "Practice stress-reduction techniques daily"
        ])
        
        return lifestyle_recs
    
    def _generate_monitoring_plan(self, conditions: List, lab_values: Dict) -> List[str]:
        """Generate specific monitoring plan"""
        monitoring_plan = []
        
        for condition in conditions:
            if 'Diabetes' in condition['name']:
                monitoring_plan.extend([
                    "Check fasting glucose 2-3 times per week initially",
                    "Monitor HbA1c every 3 months until stable, then every 6 months",
                    "Annual eye exam for diabetic retinopathy screening"
                ])
            elif 'Cardiovascular' in condition['name']:
                monitoring_plan.extend([
                    "Check blood pressure weekly at home if elevated",
                    "Repeat lipid panel in 6-8 weeks after starting interventions",
                    "Annual cardiovascular risk assessment"
                ])
            elif 'Kidney' in condition['name']:
                monitoring_plan.extend([
                    "Monitor kidney function (creatinine, BUN) every 3-6 months",
                    "Check urine for protein annually"
                ])
        
        monitoring_plan.extend([
            "Schedule comprehensive metabolic panel annually for general health monitoring",
            "Track weight, blood pressure, and any symptoms between visits"
        ])
        
        return monitoring_plan
    
    def _generate_general_analysis_insights(self, demographics: Dict, lab_values: Dict) -> List[str]:
        """Generate meaningful insights even when specific conditions aren't detected"""
        insights = []
        
        if not lab_values:
            insights.append("Report analysis complete - specific lab values not clearly identified in this document format")
            insights.append("Consider requesting structured lab report with clear value formatting for more detailed analysis")
            return insights
        
        normal_count = 0
        total_count = len(lab_values)
        
        for test_name, result in lab_values.items():
            if test_name in self.medical_terms:
                normal_range = self.medical_terms[test_name]['normal']
                if normal_range[0] <= result['value'] <= normal_range[1]:
                    normal_count += 1
        
        if normal_count == total_count:
            insights.append(f"Excellent news: All {total_count} analyzed lab values are within normal ranges")
            insights.append("Current health markers suggest good metabolic and organ function")
            insights.append("Continue current healthy lifestyle habits to maintain these optimal levels")
        elif normal_count >= total_count * 0.8:
            insights.append(f"Generally positive results: {normal_count} of {total_count} lab values are normal")
            insights.append("Most health markers are in good ranges with some areas needing attention")
        else:
            insights.append(f"Mixed results: {normal_count} of {total_count} lab values are within normal ranges")
            insights.append("Several health markers require medical evaluation and possible intervention")
        
        return insights

    def _generate_doctor_summary(self, demographics: Dict, lab_values: Dict, findings: List, risk_assessment: Dict, report_type: str) -> Dict[str, Any]:
        """Generate comprehensive professional medical summary"""
        
        # Categorize findings by system
        findings_by_system = {}
        for finding in findings:
            if 'test' in finding:
                test_type = self.medical_terms.get(finding['test'].lower().replace(' ', '_'), {}).get('type', 'general')
                if test_type not in findings_by_system:
                    findings_by_system[test_type] = []
                findings_by_system[test_type].append(finding)
        
        # Generate detailed clinical assessment
        clinical_assessment_text = self._generate_clinical_assessment_text(lab_values, findings, risk_assessment, demographics)
        
        # Create professional assessment structure
        clinical_assessment = {
            "report_type": report_type.replace('_', ' ').title(),
            "patient_demographics": demographics,
            "significant_findings": [f for f in findings if f.get('severity') in ['moderate', 'critical', 'high']],
            "normal_findings": [f for f in findings if f.get('severity') == 'normal'],
            "systems_reviewed": list(findings_by_system.keys()),
            "clinical_interpretation": clinical_assessment_text,
            "differential_diagnoses": self._generate_differential_diagnoses(lab_values, findings),
            "recommended_workup": self._generate_recommended_workup(lab_values, findings)
        }
        
        return {
            "clinical_assessment": clinical_assessment,
            "lab_values_summary": self._summarize_lab_values(lab_values),
            "risk_assessment": risk_assessment,
            "findings_by_system": findings_by_system,
            "follow_up_recommendations": self._generate_professional_recommendations(risk_assessment, findings),
            "specialist_referrals": self._recommend_specialist_referrals(lab_values, findings),
            "medication_considerations": self._suggest_medication_considerations(lab_values, findings)
        }
    
    def _generate_clinical_assessment_text(self, lab_values: Dict, findings: List, risk_assessment: Dict, demographics: Dict) -> str:
        """Generate detailed clinical assessment narrative"""
        
        assessment_parts = []
        
        # Demographics summary
        if demographics:
            demo_text = "Patient demographics: "
            if 'age' in demographics:
                demo_text += f"Age {demographics['age']}, "
            if 'gender' in demographics:
                demo_text += f"{demographics['gender']}, "
            assessment_parts.append(demo_text.rstrip(', '))
        
        # Lab values summary
        abnormal_values = []
        critical_values = []
        
        for test_name, result in lab_values.items():
            if test_name in self.medical_terms:
                normal_range = self.medical_terms[test_name]['normal']
                value = result['value']
                
                if value < normal_range[0] or value > normal_range[1]:
                    severity = 'critical' if (value > normal_range[1] * 1.5 or value < normal_range[0] * 0.5) else 'moderate'
                    if severity == 'critical':
                        critical_values.append(f"{test_name.replace('_', ' ')} {value} {result.get('unit', self.medical_terms[test_name]['units'])}")
                    else:
                        abnormal_values.append(f"{test_name.replace('_', ' ')} {value} {result.get('unit', self.medical_terms[test_name]['units'])}")
        
        if critical_values:
            assessment_parts.append(f"CRITICAL VALUES: {', '.join(critical_values)} - require immediate clinical correlation")
        
        if abnormal_values:
            assessment_parts.append(f"Abnormal findings: {', '.join(abnormal_values[:5])}")  # Limit to 5 for readability
        
        # Risk assessment summary
        if risk_assessment.get('overall_risk'):
            assessment_parts.append(f"Overall clinical risk assessment: {risk_assessment['overall_risk']} - {risk_assessment.get('risk_description', '')}")
        
        # Detected patterns summary
        pattern_summary = self._detect_clinical_patterns(lab_values)
        if pattern_summary:
            assessment_parts.append(f"Clinical pattern analysis: {pattern_summary}")
        
        return '. '.join(assessment_parts) + '.'
    
    def _detect_clinical_patterns(self, lab_values: Dict) -> str:
        """Detect clinical patterns in lab values"""
        patterns = []
        
        # Metabolic syndrome pattern
        metabolic_indicators = 0
        if 'glucose' in lab_values and lab_values['glucose']['value'] >= 100:
            metabolic_indicators += 1
        if 'triglycerides' in lab_values and lab_values['triglycerides']['value'] >= 150:
            metabolic_indicators += 1
        if 'hdl' in lab_values and lab_values['hdl']['value'] < 40:
            metabolic_indicators += 1
        if 'blood_pressure_systolic' in lab_values and lab_values['blood_pressure_systolic']['value'] >= 130:
            metabolic_indicators += 1
        
        if metabolic_indicators >= 3:
            patterns.append("metabolic syndrome pattern present")
        elif metabolic_indicators >= 2:
            patterns.append("partial metabolic syndrome pattern")
        
        # Diabetes pattern
        if ('glucose' in lab_values and lab_values['glucose']['value'] >= 126) or \
           ('hba1c' in lab_values and lab_values['hba1c']['value'] >= 6.5):
            patterns.append("diabetes mellitus pattern")
        elif ('glucose' in lab_values and lab_values['glucose']['value'] >= 100) or \
             ('hba1c' in lab_values and lab_values['hba1c']['value'] >= 5.7):
            patterns.append("prediabetes pattern")
        
        # Cardiovascular risk pattern
        cv_risk_factors = 0
        if 'cholesterol' in lab_values and lab_values['cholesterol']['value'] >= 200:
            cv_risk_factors += 1
        if 'ldl' in lab_values and lab_values['ldl']['value'] >= 130:
            cv_risk_factors += 1
        if 'hdl' in lab_values and lab_values['hdl']['value'] < 40:
            cv_risk_factors += 1
        
        if cv_risk_factors >= 2:
            patterns.append("high cardiovascular risk profile")
        
        # Liver function pattern
        if ('alt' in lab_values and lab_values['alt']['value'] > 56) or \
           ('ast' in lab_values and lab_values['ast']['value'] > 40):
            patterns.append("hepatic enzyme elevation pattern")
        
        return ', '.join(patterns) if patterns else ""
    
    def _generate_differential_diagnoses(self, lab_values: Dict, findings: List) -> List[str]:
        """Generate differential diagnoses based on lab patterns"""
        differentials = []
        
        # Diabetes differentials
        if ('glucose' in lab_values and lab_values['glucose']['value'] >= 126) or \
           ('hba1c' in lab_values and lab_values['hba1c']['value'] >= 6.5):
            differentials.extend([
                "Type 2 Diabetes Mellitus (most likely given age/pattern)",
                "Type 1 Diabetes Mellitus (consider if younger patient or rapid onset)",
                "Secondary diabetes (medication-induced, pancreatic disease)"
            ])
        
        # Cardiovascular differentials
        cv_abnormal = ('cholesterol' in lab_values and lab_values['cholesterol']['value'] >= 240) or \
                      ('ldl' in lab_values and lab_values['ldl']['value'] >= 160) or \
                      ('blood_pressure_systolic' in lab_values and lab_values['blood_pressure_systolic']['value'] >= 140)
        
        if cv_abnormal:
            differentials.extend([
                "Primary hyperlipidemia/dyslipidemia",
                "Essential hypertension",
                "Metabolic syndrome",
                "Familial hypercholesterolemia (if very high cholesterol)"
            ])
        
        # Kidney function differentials
        if ('creatinine' in lab_values and lab_values['creatinine']['value'] >= 1.5) or \
           ('bun' in lab_values and lab_values['bun']['value'] >= 30):
            differentials.extend([
                "Chronic kidney disease",
                "Acute kidney injury",
                "Diabetic nephropathy",
                "Hypertensive nephropathy"
            ])
        
        # Liver differentials
        if ('alt' in lab_values and lab_values['alt']['value'] > 100) or \
           ('ast' in lab_values and lab_values['ast']['value'] > 80):
            differentials.extend([
                "Non-alcoholic fatty liver disease",
                "Medication-induced hepatotoxicity",
                "Viral hepatitis",
                "Alcoholic liver disease"
            ])
        
        return differentials[:8]  # Limit to top 8 differentials
    
    def _generate_recommended_workup(self, lab_values: Dict, findings: List) -> List[str]:
        """Generate recommended additional workup"""
        workup = []
        
        # Diabetes workup
        if ('glucose' in lab_values and lab_values['glucose']['value'] >= 100) or \
           ('hba1c' in lab_values and lab_values['hba1c']['value'] >= 5.7):
            workup.extend([
                "Fasting glucose confirmation if not already done",
                "Comprehensive diabetic panel (microalbumin, diabetic eye exam)",
                "Lipid panel if not recent",
                "Diabetic foot exam"
            ])
        
        # Cardiovascular workup
        if ('cholesterol' in lab_values and lab_values['cholesterol']['value'] >= 200) or \
           ('blood_pressure_systolic' in lab_values and lab_values['blood_pressure_systolic']['value'] >= 130):
            workup.extend([
                "Cardiovascular risk stratification (ASCVD risk calculator)",
                "EKG to assess for cardiac changes",
                "Consider echocardiogram if indicated",
                "Ankle-brachial index if peripheral artery disease suspected"
            ])
        
        # Kidney workup
        if ('creatinine' in lab_values and lab_values['creatinine']['value'] >= 1.2):
            workup.extend([
                "Estimated GFR calculation",
                "Urinalysis with microscopy",
                "Urine microalbumin",
                "Renal ultrasound if GFR <60"
            ])
        
        # General workup
        workup.extend([
            "Complete metabolic panel if not done within 1 year",
            "Thyroid function testing if not recent",
            "Vitamin D level assessment"
        ])
        
        return workup[:10]  # Limit to top 10 recommendations
    
    def _recommend_specialist_referrals(self, lab_values: Dict, findings: List) -> List[str]:
        """Recommend specialist referrals based on findings"""
        referrals = []
        
        # Endocrinology referrals
        if ('glucose' in lab_values and lab_values['glucose']['value'] >= 126) or \
           ('hba1c' in lab_values and lab_values['hba1c']['value'] >= 6.5):
            referrals.append("Endocrinology - for diabetes management and optimization")
        elif ('glucose' in lab_values and lab_values['glucose']['value'] >= 100) or \
             ('hba1c' in lab_values and lab_values['hba1c']['value'] >= 5.7):
            referrals.append("Endocrinology or Diabetes Educator - for prediabetes management")
        
        # Cardiology referrals
        high_cv_risk = ('cholesterol' in lab_values and lab_values['cholesterol']['value'] >= 240) or \
                       ('ldl' in lab_values and lab_values['ldl']['value'] >= 160) or \
                       ('blood_pressure_systolic' in lab_values and lab_values['blood_pressure_systolic']['value'] >= 160)
        
        if high_cv_risk:
            referrals.append("Cardiology - for cardiovascular risk assessment and management")
        
        # Nephrology referrals
        if ('creatinine' in lab_values and lab_values['creatinine']['value'] >= 1.5):
            referrals.append("Nephrology - for kidney function evaluation")
        
        # Hepatology referrals
        if ('alt' in lab_values and lab_values['alt']['value'] > 100) or \
           ('ast' in lab_values and lab_values['ast']['value'] > 100):
            referrals.append("Gastroenterology/Hepatology - for liver function evaluation")
        
        return referrals
    
    def _suggest_medication_considerations(self, lab_values: Dict, findings: List) -> List[str]:
        """Suggest medication considerations based on findings"""
        medications = []
        
        # Diabetes medications
        if ('glucose' in lab_values and lab_values['glucose']['value'] >= 126) or \
           ('hba1c' in lab_values and lab_values['hba1c']['value'] >= 6.5):
            medications.extend([
                "Consider metformin as first-line diabetes therapy",
                "Evaluate need for additional antidiabetic agents based on HbA1c goal",
                "Consider insulin therapy if severe hyperglycemia"
            ])
        
        # Cardiovascular medications
        if 'cholesterol' in lab_values and lab_values['cholesterol']['value'] >= 200:
            medications.append("Consider statin therapy for cholesterol management")
        
        if ('blood_pressure_systolic' in lab_values and lab_values['blood_pressure_systolic']['value'] >= 130) or \
           ('blood_pressure_diastolic' in lab_values and lab_values['blood_pressure_diastolic']['value'] >= 80):
            medications.extend([
                "Consider ACE inhibitor or ARB for blood pressure management",
                "Evaluate need for additional antihypertensive agents"
            ])
        
        # Preventive medications
        cv_risk_factors = 0
        if 'cholesterol' in lab_values and lab_values['cholesterol']['value'] >= 200:
            cv_risk_factors += 1
        if 'glucose' in lab_values and lab_values['glucose']['value'] >= 100:
            cv_risk_factors += 1
        if 'blood_pressure_systolic' in lab_values and lab_values['blood_pressure_systolic']['value'] >= 130:
            cv_risk_factors += 1
            
        if cv_risk_factors >= 2:
            medications.append("Consider low-dose aspirin for cardiovascular protection (if no contraindications)")
        
        return medications

    def _summarize_lab_values(self, lab_values: Dict) -> List[Dict]:
        """Summarize lab values for professional review"""
        summary = []
        
        for test_name, result in lab_values.items():
            if test_name in self.medical_terms:
                normal_range = self.medical_terms[test_name]['normal']
                value = result['value']
                unit = result.get('unit', self.medical_terms[test_name]['units'])
                
                status = 'Normal'
                if value < normal_range[0]:
                    status = 'Low'
                elif value > normal_range[1]:
                    status = 'Elevated'
                
                summary.append({
                    "test": test_name.replace('_', ' ').title(),
                    "value": f"{value} {unit}",
                    "reference": f"{normal_range[0]}-{normal_range[1]} {self.medical_terms[test_name]['units']}",
                    "status": status,
                    "category": self.medical_terms[test_name]['type']
                })
        
        return summary

    def _generate_professional_recommendations(self, risk_assessment: Dict, findings: List) -> List[str]:
        """Generate professional medical recommendations"""
        recommendations = []
        
        # Risk-based recommendations
        if risk_assessment['overall_risk'] == 'High':
            recommendations.append("Consider immediate clinical correlation and intervention")
            recommendations.append("Patient may benefit from specialist referral")
        elif risk_assessment['overall_risk'] == 'Moderate':
            recommendations.append("Close monitoring and follow-up recommended")
            recommendations.append("Consider lifestyle interventions and possible pharmacotherapy")
        
        # System-specific recommendations
        critical_findings = [f for f in findings if f.get('severity') == 'critical']
        if critical_findings:
            recommendations.append("Critical values noted - consider immediate clinical action")
        
        # Add general recommendations
        recommendations.extend([
            "Correlate with clinical presentation and patient history",
            "Consider serial monitoring of abnormal values",
            "Patient counseling on lifestyle modifications recommended"
        ])
        
        return recommendations

    def _calculate_confidence(self, text: str, lab_values: Dict) -> float:
        """Calculate confidence score for the analysis"""
        confidence_factors = []
        
        # Text quality factors
        if len(text) > 100:
            confidence_factors.append(0.3)
        if len(text) > 500:
            confidence_factors.append(0.2)
        
        # Lab values extraction success
        if lab_values:
            confidence_factors.append(0.4)
            if len(lab_values) > 3:
                confidence_factors.append(0.1)
        
        # Pattern matching success
        medical_pattern_count = len(re.findall(r'(?:mg/dl|mmhg|g/dl|u/l|%)', text.lower()))
        if medical_pattern_count > 0:
            confidence_factors.append(min(0.3, medical_pattern_count * 0.1))
        
        return min(1.0, sum(confidence_factors))


# Global analyzer instance
medical_analyzer = MedicalTextAnalyzer()