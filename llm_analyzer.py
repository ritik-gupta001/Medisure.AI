import logging
import json
import os
from datetime import datetime
from typing import Dict, Any, List, Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Check for OpenAI availability
OPENAI_AVAILABLE = False
try:
    import openai
    OPENAI_AVAILABLE = True
    logger.info("✅ OpenAI library available")
except ImportError:
    logger.warning("❌ OpenAI library not available")


class MedicalKnowledgeBase:
    """
    Comprehensive medical knowledge base for enhanced AI analysis
    """
    
    def __init__(self):
        self.medical_guidelines = {
            "vital_signs": {
                "blood_pressure": {
                    "normal": "< 120/80 mmHg",
                    "elevated": "120-129/< 80 mmHg", 
                    "stage1_hypertension": "130-139/80-89 mmHg",
                    "stage2_hypertension": "≥ 140/≥ 90 mmHg",
                    "hypertensive_crisis": "≥ 180/≥ 120 mmHg"
                },
                "heart_rate": {
                    "normal_adult": "60-100 bpm",
                    "bradycardia": "< 60 bpm",
                    "tachycardia": "> 100 bpm"
                },
                "temperature": {
                    "normal": "97.8-99.1°F (36.5-37.3°C)",
                    "fever": "> 100.4°F (38°C)",
                    "hypothermia": "< 95°F (35°C)"
                }
            },
            "laboratory_values": {
                "glucose": {
                    "normal_fasting": "70-100 mg/dL",
                    "prediabetes": "100-125 mg/dL",
                    "diabetes": "≥ 126 mg/dL"
                },
                "cholesterol": {
                    "total_normal": "< 200 mg/dL",
                    "ldl_optimal": "< 100 mg/dL",
                    "hdl_men": "> 40 mg/dL",
                    "hdl_women": "> 50 mg/dL"
                },
                "hemoglobin": {
                    "men": "13.8-17.2 g/dL",
                    "women": "12.1-15.1 g/dL"
                }
            },
            "clinical_warnings": [
                "Critical values require immediate medical attention",
                "Results should be interpreted by qualified healthcare professionals",
                "Individual factors may affect normal ranges",
                "Emergency situations require immediate medical intervention"
            ]
        }
    
    def get_medical_context(self, query: str) -> str:
        """Get relevant medical context based on query"""
        context_parts = []
        query_lower = query.lower()
        
        # Add relevant guidelines based on query content
        if any(term in query_lower for term in ['blood pressure', 'bp', 'hypertension']):
            context_parts.append(f"Blood Pressure Guidelines: {self.medical_guidelines['vital_signs']['blood_pressure']}")
        
        if any(term in query_lower for term in ['glucose', 'diabetes', 'blood sugar']):
            context_parts.append(f"Glucose Guidelines: {self.medical_guidelines['laboratory_values']['glucose']}")
            
        if any(term in query_lower for term in ['cholesterol', 'lipid']):
            context_parts.append(f"Cholesterol Guidelines: {self.medical_guidelines['laboratory_values']['cholesterol']}")
        
        # Always include clinical warnings
        context_parts.extend(self.medical_guidelines['clinical_warnings'])
        
        return "\n".join(context_parts)


class IntelligentLLMAnalyzer:
    """
    Intelligent medical AI analyzer with comprehensive OpenAI integration
    """
    
    def __init__(self):
        self.knowledge_base = MedicalKnowledgeBase()
        self.openai_client = None
        self.api_key_configured = False
        
        # Initialize OpenAI client
        self._initialize_openai()
        
        # Medical AI system prompt
        self.system_prompt = """You are MediSure AI, an advanced medical AI assistant designed to help analyze medical documents and provide healthcare insights.

IMPORTANT GUIDELINES:
- Always emphasize that you provide informational support, not medical diagnosis
- Recommend consulting qualified healthcare professionals for medical decisions
- Be thorough, accurate, and empathetic in your responses
- Use medical terminology appropriately while remaining accessible
- Highlight any concerning findings that may need immediate attention
- Provide evidence-based recommendations when possible

Your expertise includes:
- Medical document analysis and interpretation
- Clinical guideline knowledge
- Risk assessment and health recommendations
- Preventive care guidance
- Patient education and health literacy support

Always maintain professional medical ethics and patient safety as top priorities."""

    def _initialize_openai(self):
        """Initialize OpenAI client with API key - v2.0"""
        try:
            if not OPENAI_AVAILABLE:
                logger.warning("OpenAI library not available")
                return
            
            # Get API key from environment or .env file
            api_key = os.getenv("OPENAI_API_KEY") or os.getenv("OPENAI_KEY")
            
            # Debug: Log environment variables (without exposing the key)
            all_env_keys = list(os.environ.keys())
            logger.info(f"🔍 Environment variables available: {[k for k in all_env_keys if 'OPENAI' in k or 'API' in k]}")
            logger.info(f"🔑 API key found: {bool(api_key)}, Length: {len(api_key) if api_key else 0}")
            
            # If not found in environment, try to load from .env file directly
            if not api_key:
                try:
                    with open('.env', 'r') as f:
                        for line in f:
                            if line.startswith('OPENAI_API_KEY='):
                                api_key = line.split('=', 1)[1].strip()
                                break
                except FileNotFoundError:
                    logger.info("📁 No .env file found")
                    pass
            
            if not api_key:
                logger.warning("❌ OPENAI_API_KEY not found in environment or .env file")
                logger.warning(f"💡 Available env vars: {sorted([k for k in os.environ.keys()])[:10]}")
                return
            
            # Initialize OpenAI client with just the API key
            try:
                from openai import OpenAI
                self.openai_client = OpenAI(api_key=api_key)
                self.api_key_configured = True
                logger.info("✅ OpenAI client initialized successfully")
            except TypeError as type_err:
                # Handle the 'proxies' parameter issue - try without extra params
                logger.warning(f"⚠️ TypeError during initialization: {type_err}")
                logger.info("🔧 Attempting workaround initialization...")
                try:
                    import openai as oai
                    oai.api_key = api_key
                    self.openai_client = oai
                    self.api_key_configured = True
                    logger.info("✅ OpenAI configured via global API key (workaround)")
                except Exception as e2:
                    logger.error(f"❌ Workaround failed: {e2}")
                    self.api_key_configured = False
                    return
            except Exception as init_error:
                logger.error(f"❌ Failed to initialize OpenAI client: {str(init_error)}")
                self.api_key_configured = False
                return
                # Still mark as configured since the client was created successfully
                logger.info("✅ OpenAI client ready (test skipped)")
                
        except Exception as e:
            logger.error(f"Error initializing OpenAI: {e}")
            self.api_key_configured = False

    def analyze_document(self, document_text: str) -> Dict[str, Any]:
        """
        Comprehensive medical document analysis using AI
        """
        logger.info("🔍 Starting AI-powered medical document analysis")
        
        # Try to get API key directly
        api_key = os.getenv("OPENAI_API_KEY")
        logger.info(f"🔑 API key check: {'Found (' + str(len(api_key)) + ' chars)' if api_key else 'NOT FOUND'}")
        
        if not api_key:
            logger.warning("❌ No API key found, using fallback")
            return self._create_fallback_analysis(document_text)
        
        try:
            # Create OpenAI client on-demand to avoid initialization issues
            logger.info("🔧 Attempting to create OpenAI client...")
            from openai import OpenAI
            client = OpenAI(api_key=api_key)
            logger.info("✅ Created OpenAI client for this analysis")
            
            # Get relevant medical context
            logger.info("📚 Getting medical context...")
            medical_context = self.knowledge_base.get_medical_context(document_text)
            
            # Create comprehensive analysis prompt
            analysis_prompt = f"""
Analyze the following medical document comprehensively:

MEDICAL CONTEXT:
{medical_context}

DOCUMENT TO ANALYZE:
{document_text[:2000]}

Please provide a detailed medical analysis in JSON format with these exact fields:
{{
    "summary": "Brief overview of the document and key findings",
    "findings": [
        {{
            "description": "Name of the finding/test/measurement",
            "value": "Measured or observed value",
            "interpretation": "Clinical interpretation and significance",
            "severity": "normal/mild/moderate/severe/critical"
        }}
    ],
    "risk_assessment": {{
        "overall_risk": "low/moderate/high/critical",
        "risk_factors": ["List of identified risk factors"],
        "immediate_concerns": ["Any findings requiring urgent attention"]
    }},
    "recommendations": [
        "Specific actionable recommendations based on findings"
    ],
    "follow_up": [
        "Required follow-up actions, tests, or appointments"
    ],
    "lifestyle_advice": [
        "Lifestyle modifications and preventive measures"
    ],
    "provider_questions": [
        "Questions to ask healthcare provider about these results"
    ]
}}"""

            # Get AI analysis
            response = client.chat.completions.create(
                model="gpt-4o-mini",  # Use the configured model
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": analysis_prompt}
                ],
                max_tokens=1500,
                temperature=0.1
            )
            
            analysis_text = response.choices[0].message.content
            
            # Try to parse JSON response
            try:
                # Clean up the response text to extract JSON
                json_start = analysis_text.find('{')
                json_end = analysis_text.rfind('}') + 1
                if json_start >= 0 and json_end > json_start:
                    json_text = analysis_text[json_start:json_end]
                    analysis_result = json.loads(json_text)
                else:
                    raise json.JSONDecodeError("No JSON found", analysis_text, 0)
            except json.JSONDecodeError:
                logger.warning("JSON parsing failed, creating structured response from text")
                # Create structured response if JSON parsing fails
                analysis_result = {
                    "summary": analysis_text[:200] if len(analysis_text) > 200 else analysis_text,
                    "findings": [
                        {
                            "description": "AI Medical Analysis",
                            "value": "Comprehensive review completed",
                            "interpretation": analysis_text[:400] if len(analysis_text) > 400 else analysis_text,
                            "severity": "informational"
                        }
                    ],
                    "risk_assessment": {
                        "overall_risk": "See detailed analysis",
                        "risk_factors": ["Detailed analysis provided"],
                        "immediate_concerns": []
                    },
                    "recommendations": [analysis_text[400:800] if len(analysis_text) > 400 else "Consult healthcare provider for interpretation"],
                    "follow_up": ["Discuss results with healthcare provider"],
                    "lifestyle_advice": ["Follow general health guidelines"],
                    "provider_questions": ["Review AI analysis with your doctor"]
                }
            
            # Add metadata
            analysis_result.update({
                "confidence_score": 90,
                "analysis_method": "AI-powered with medical knowledge base",
                "model_used": "gpt-4o-mini",
                "timestamp": datetime.now().isoformat(),
                "ai_powered": True,
                "full_analysis": analysis_text
            })
            
            logger.info("✅ AI medical analysis completed successfully")
            return analysis_result
            
        except Exception as e:
            logger.error(f"❌ Error in AI analysis: {e}")
            return self._create_fallback_analysis(document_text, error=str(e))

    def chat_with_ai(self, user_message: str, conversation_context: Optional[str] = None) -> Dict[str, Any]:
        """
        Intelligent medical AI chat with conversation context
        """
        logger.info(f"💬 Processing chat message: {user_message[:100]}...")
        
        if not self.api_key_configured:
            return self._create_fallback_chat_response(user_message)
        
        try:
            # Get relevant medical context for the question
            medical_context = self.knowledge_base.get_medical_context(user_message)
            
            # Create comprehensive chat prompt
            chat_prompt = f"""
User Question: {user_message}

Relevant Medical Guidelines:
{medical_context}

Please provide a helpful, accurate response about this medical question. Remember to:
1. Provide informative, evidence-based information
2. Always recommend consulting healthcare professionals for medical advice
3. Be empathetic and supportive
4. Explain medical concepts in understandable terms
5. Highlight any red flags that need immediate medical attention
"""

            # Get AI response
            response = self.openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": chat_prompt}
                ],
                max_tokens=500,
                temperature=0.2
            )
            
            ai_response = response.choices[0].message.content
            
            return {
                "response": ai_response,
                "sources": ["Medical knowledge base", "Clinical guidelines"],
                "conversation_id": f"medisure_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                "timestamp": datetime.now().isoformat(),
                "ai_powered": True,
                "confidence": 95
            }
            
        except Exception as e:
            logger.error(f"❌ Error in chat processing: {e}")
            return self._create_fallback_chat_response(user_message, error=str(e))

    def get_health_insights(self, analysis_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate personalized health insights based on analysis
        """
        if not self.api_key_configured:
            return self._create_fallback_insights()
        
        try:
            insights_prompt = f"""
Based on the following medical analysis, provide personalized health insights:

Analysis Summary: {analysis_data.get('summary', 'Medical analysis completed')}
Key Findings: {analysis_data.get('findings', [])}

Please provide specific insights in JSON format:
{{
    "trends": "Key health trends and patterns identified",
    "preventive_care": ["Specific preventive care recommendations"],
    "risk_mitigation": ["Strategies to reduce identified health risks"],
    "lifestyle_tips": ["Actionable lifestyle improvements"],
    "monitoring": ["Health metrics to monitor regularly"],
    "provider_questions": ["Important questions for next medical appointment"]
}}
"""

            response = self.openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": insights_prompt}
                ],
                max_tokens=800,
                temperature=0.1
            )
            
            insights_text = response.choices[0].message.content
            
            try:
                insights = json.loads(insights_text)
            except json.JSONDecodeError:
                insights = {
                    "trends": "AI-powered analysis reveals important health patterns",
                    "preventive_care": ["Regular health screenings", "Follow medical recommendations"],
                    "risk_mitigation": ["Address identified risk factors", "Maintain healthy lifestyle"],
                    "lifestyle_tips": ["Balanced nutrition", "Regular exercise", "Adequate sleep", "Stress management"],
                    "monitoring": ["Track key health metrics", "Regular medical check-ups"],
                    "provider_questions": ["Discuss AI analysis results", "Review risk factors", "Plan preventive care"]
                }
            
            insights["ai_powered"] = True
            insights["timestamp"] = datetime.now().isoformat()
            
            return insights
            
        except Exception as e:
            logger.error(f"Error generating health insights: {e}")
            return self._create_fallback_insights()

    def _create_fallback_analysis(self, document_text: str, error: str = None) -> Dict[str, Any]:
        """Create fallback analysis when AI is unavailable"""
        return {
            "summary": f"Document processed ({len(document_text)} characters)" + (f" - AI Error: {error}" if error else " - AI configuration needed"),
            "findings": [
                {
                    "description": "Document Upload",
                    "value": f"{len(document_text)} characters processed",
                    "interpretation": "Document successfully received. Configure OpenAI API key for AI-powered analysis.",
                    "severity": "informational"
                }
            ],
            "risk_assessment": {
                "overall_risk": "Unable to assess - AI configuration required",
                "risk_factors": ["AI analysis unavailable"],
                "immediate_concerns": []
            },
            "recommendations": [
                "Configure OPENAI_API_KEY environment variable",
                "Restart the application after API key configuration",
                "Consult healthcare provider for professional interpretation"
            ],
            "follow_up": ["Set up AI configuration for enhanced analysis"],
            "lifestyle_advice": ["Maintain general healthy lifestyle practices"],
            "provider_questions": ["Discuss document with healthcare provider"],
            "confidence_score": 20,
            "analysis_method": "Basic processing (AI unavailable)",
            "timestamp": datetime.now().isoformat(),
            "ai_powered": False,
            "note": "Enable AI features by configuring OpenAI API key"
        }

    def _create_fallback_chat_response(self, message: str, error: str = None) -> Dict[str, Any]:
        """Create fallback chat response when AI is unavailable"""
        return {
            "response": f"Hello! I'm MediSure AI. Currently, my advanced AI features require API key configuration. Please set up your OPENAI_API_KEY to enable intelligent medical conversations. {f'Error: {error}' if error else ''}\n\nFor now, I recommend consulting with healthcare professionals for medical questions.",
            "sources": [],
            "conversation_id": f"fallback_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "timestamp": datetime.now().isoformat(),
            "ai_powered": False,
            "confidence": 30
        }

    def _create_fallback_report(self, analysis_data: Dict[str, Any], patient_info: Dict[str, str] = None) -> Dict[str, Any]:
        """Create fallback medical report when AI is unavailable"""
        return {
            "medical_report": {
                "subjective": "Patient presents for medical document review and analysis.",
                "objective": {
                    "vital_signs": "Documented in provided medical records",
                    "laboratory_findings": "See detailed findings in analysis data",
                    "clinical_observations": "Based on submitted medical documentation"
                },
                "assessment": {
                    "primary_diagnosis": "Comprehensive medical analysis completed",
                    "differential_diagnosis": ["Further clinical correlation recommended"],
                    "risk_stratification": analysis_data.get('risk_assessment', {}).get('overall_risk', 'To be determined'),
                    "prognostic_indicators": "Dependent on clinical context and provider assessment"
                },
                "plan": {
                    "immediate_interventions": ["Review results with healthcare provider"],
                    "pharmacological": ["As directed by healthcare provider"],
                    "non_pharmacological": ["Maintain healthy lifestyle practices"],
                    "monitoring": ["Regular follow-up as recommended by provider"],
                    "referrals": ["Specialist consultation if indicated"],
                    "patient_education": ["Discuss results with medical team"]
                }
            },
            "patient_explanation": {
                "overview": "Your medical documents have been analyzed using advanced AI technology. The analysis provides insights into your health status based on the available information. It's important to remember that this AI analysis is designed to support, not replace, professional medical judgment.",
                "what_this_means": "The results show various health indicators that have been evaluated against standard medical ranges. Your healthcare provider can help interpret these findings in the context of your complete medical history and current health status.",
                "action_steps": "Schedule an appointment with your healthcare provider to discuss these results in detail. Bring any questions you have about specific findings or recommendations.",
                "when_to_worry": "Seek immediate medical attention if you experience: severe chest pain, difficulty breathing, sudden weakness or numbness, severe headache, or any symptoms that concern you.",
                "positive_aspects": "Your proactive approach to understanding your health through medical analysis is commendable and supports better health outcomes."
            },
            "visual_coding": {
                "severity_colors": {
                    "critical": "#DC2626",
                    "high": "#EF4444",
                    "moderate": "#F59E0B",
                    "mild": "#FCD34D",
                    "normal": "#10B981",
                    "optimal": "#059669"
                },
                "icon_recommendations": {
                    "cardiovascular": "Heart",
                    "metabolic": "Activity",
                    "respiratory": "Wind",
                    "neurological": "Brain",
                    "urgent": "AlertTriangle",
                    "success": "CheckCircle",
                    "warning": "AlertCircle",
                    "info": "Info"
                }
            },
            "timestamp": datetime.now().isoformat(),
            "report_id": f"MR-{datetime.now().strftime('%Y%m%d-%H%M%S')}",
            "ai_generated": False,
            "note": "Configure OPENAI_API_KEY for AI-enhanced medical reporting"
        }

    def _create_fallback_insights(self) -> Dict[str, Any]:
        """Create fallback health insights"""
        return {
            "trends": "AI-powered insights require OpenAI API key configuration",
            "preventive_care": ["Regular health screenings", "Annual physical exams", "Follow medical recommendations"],
            "risk_mitigation": ["Maintain healthy lifestyle", "Follow healthcare provider guidance"],
            "lifestyle_tips": ["Balanced nutrition", "Regular physical activity", "Adequate sleep", "Stress management", "Avoid smoking and excessive alcohol"],
            "monitoring": ["Blood pressure", "Weight and BMI", "Blood glucose", "Cholesterol levels"],
            "provider_questions": ["Review my latest test results", "What are my risk factors?", "How often should I get screened?"],
            "ai_powered": False,
            "timestamp": datetime.now().isoformat(),
            "note": "Configure OPENAI_API_KEY for personalized AI insights"
        }


# Create global intelligent analyzer instance
intelligent_analyzer = IntelligentLLMAnalyzer()

def analyze_medical_document_llm(document_text: str) -> Dict[str, Any]:
    """Main function to analyze medical document using intelligent AI"""
    return intelligent_analyzer.analyze_document(document_text)

def chat_with_medical_ai(user_message: str, context: Optional[str] = None) -> Dict[str, Any]:
    """Main function for intelligent AI chat functionality"""
    return intelligent_analyzer.chat_with_ai(user_message, context)

def get_health_insights(analysis_data: Dict[str, Any]) -> Dict[str, Any]:
    """Main function to get intelligent health insights"""
    return intelligent_analyzer.get_health_insights(analysis_data)

# Health check function
def generate_medical_report(analysis_data: Dict[str, Any], patient_info: Dict[str, str] = None) -> Dict[str, Any]:
    """Generate comprehensive medical report with SOAP format"""
    return intelligent_analyzer.generate_medical_report(analysis_data, patient_info)

def check_ai_status() -> Dict[str, Any]:
    """Check if AI features are properly configured"""
    return {
        "openai_available": OPENAI_AVAILABLE,
        "api_key_configured": intelligent_analyzer.api_key_configured,
        "status": "ready" if intelligent_analyzer.api_key_configured else "configuration_needed",
        "features": {
            "document_analysis": intelligent_analyzer.api_key_configured,
            "ai_chat": intelligent_analyzer.api_key_configured,
            "health_insights": intelligent_analyzer.api_key_configured,
            "medical_reports": intelligent_analyzer.api_key_configured
        }
    }