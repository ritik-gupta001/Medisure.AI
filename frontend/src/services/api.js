// API service for communicating with MediSense backend
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

class MediSenseAPIService {
  constructor() {
    this.apiClient = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000, // 30 seconds for file upload
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for logging
    this.apiClient.interceptors.request.use(
      (config) => {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.apiClient.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('❌ API Response Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Upload and analyze medical document
   */
  async analyzeDocument(file, patientId, userId = 'demo_user', enableShap = true) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('patient_id', patientId || `patient_${Date.now()}`);
    formData.append('user_id', userId);
    formData.append('enable_shap', enableShap);

    try {
      const response = await this.apiClient.post('/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`📤 Upload Progress: ${progress}%`);
        },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  }

  /**
   * Get detailed analysis results
   */
  async getResult(sessionId) {
    try {
      const response = await this.apiClient.get(`/result/${sessionId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  }

  /**
   * Chat interface for follow-up questions
   */
  async sendChatMessage(sessionId, question, contextLine = null, userId = 'demo_user') {
    try {
      const response = await this.apiClient.post('/chat', {
        session_id: sessionId,
        question: question,
        context_line: contextLine,
        user_id: userId,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  }

  /**
   * Get SHAP visualization data
   */
  async getSHAPData(sessionId) {
    try {
      const response = await this.apiClient.get(`/shap/${sessionId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      const response = await this.apiClient.get('/health');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  }

  /**
   * Create mock analysis for demo purposes
   */
  createMockAnalysis() {
    return {
      session_id: `mock_${Date.now()}`,
      status: 'completed',
      processing_time: 2.5,
      patient_summary: {
        patient_id: 'DEMO_001',
        demographics: {
          age: 58,
          sex: 'Female',
          patient_id: 'DEMO_001'
        },
        clinical_findings: [
          {
            finding: 'Elevated cholesterol levels',
            value: '268 mg/dL',
            normal_range: '< 200 mg/dL',
            significance: 'High'
          },
          {
            finding: 'Blood pressure reading',
            value: '158/94 mmHg',
            normal_range: '< 120/80 mmHg',
            significance: 'High'
          },
          {
            finding: 'HbA1c level',
            value: '7.8%',
            normal_range: '< 5.7%',
            significance: 'High'
          }
        ],
        lab_results: {
          total_cholesterol: 268,
          hdl_cholesterol: 38,
          ldl_cholesterol: 175,
          triglycerides: 275,
          glucose_fasting: 142,
          hba1c: 7.8,
          systolic_bp: 158,
          diastolic_bp: 94
        },
        risk_factors: [
          'Dyslipidemia (high cholesterol)',
          'Type 2 Diabetes Mellitus',
          'Hypertension',
          'Age-related cardiovascular risk'
        ],
        recommendations: [
          'Discuss statin therapy with your healthcare provider',
          'Implement dietary changes to reduce cholesterol and manage diabetes',
          'Regular blood pressure monitoring at home',
          'Follow up with your doctor within 6-8 weeks',
          'Consider cardiology consultation for comprehensive risk assessment'
        ],
        summary_text: 'Your recent lab results show several important findings that need attention. You have elevated cholesterol levels, diabetes that needs better control, and high blood pressure. These conditions increase your risk for heart disease, but with proper treatment and lifestyle changes, we can significantly improve your health outcomes. Your doctor will work with you to develop a comprehensive treatment plan.',
        confidence_score: 0.92
      },
      doctor_summary: {
        clinical_assessment: 'This 58-year-old female patient presents with multiple cardiovascular risk factors including dyslipidemia, poorly controlled type 2 diabetes mellitus, and stage 1 hypertension. The constellation of findings indicates high cardiovascular risk requiring aggressive risk factor modification and likely pharmacologic intervention.',
        differential_diagnosis: [
          {
            diagnosis: 'Dyslipidemia (Mixed hyperlipidemia)',
            probability: 0.95,
            evidence: ['Total cholesterol 268 mg/dL', 'HDL 38 mg/dL', 'LDL 175 mg/dL', 'Triglycerides 275 mg/dL']
          },
          {
            diagnosis: 'Type 2 Diabetes Mellitus (poorly controlled)',
            probability: 0.90,
            evidence: ['HbA1c 7.8%', 'Fasting glucose 142 mg/dL']
          },
          {
            diagnosis: 'Hypertension, Stage 1',
            probability: 0.85,
            evidence: ['Blood pressure 158/94 mmHg']
          },
          {
            diagnosis: 'Metabolic Syndrome',
            probability: 0.80,
            evidence: ['Multiple risk factors present', 'Central obesity likely']
          }
        ],
        risk_stratification: {
          overall_risk: 'High',
          '10_year_cv_risk': 0.78,
          risk_category: 'High'
        },
        treatment_recommendations: [
          {
            intervention: 'High-intensity statin therapy (e.g., Atorvastatin 40-80mg)',
            priority: 'High',
            evidence_level: '1A'
          },
          {
            intervention: 'ACE inhibitor or ARB for blood pressure control',
            priority: 'High',
            evidence_level: '1A'
          },
          {
            intervention: 'Diabetes medication optimization (Metformin, consider SGLT2i)',
            priority: 'High',
            evidence_level: '1A'
          },
          {
            intervention: 'Lifestyle modifications (diet, exercise, weight loss)',
            priority: 'High',
            evidence_level: '1A'
          }
        ],
        follow_up_plan: [
          'Repeat comprehensive metabolic panel and lipid profile in 6-8 weeks',
          'Blood pressure monitoring - consider home monitoring',
          'Diabetes management - quarterly HbA1c monitoring',
          'Cardiology consultation for risk stratification',
          'Nutritionist referral for dietary counseling',
          'Consider cardiac stress test if symptomatic'
        ],
        evidence_citations: [
          {
            source: '2019 AHA/ACC Primary Prevention Guidelines',
            relevance: 0.95,
            recommendation: 'Statin therapy for high-risk patients'
          },
          {
            source: '2021 ADA Standards of Medical Care',
            relevance: 0.90,
            recommendation: 'HbA1c target <7% for most adults'
          }
        ],
        technical_notes: 'Analysis completed with high confidence. Risk assessment based on validated cardiovascular risk calculators. Patient would benefit from comprehensive lifestyle intervention program.',
        model_interpretation: {
          primary_risk_drivers: ['Age (58 years)', 'Total cholesterol (268)', 'HDL cholesterol (38)', 'Blood pressure (158/94)', 'Diabetes (HbA1c 7.8%)'],
          model_confidence: 0.92,
          data_quality: 'Excellent - comprehensive lab panel available'
        }
      },
      shap_analysis: {
        feature_importance: {
          age: 0.15,
          total_cholesterol: 0.25,
          hdl_cholesterol: 0.18,
          systolic_bp: 0.20,
          diabetes: 0.22
        },
        feature_names: ['Age', 'Total Cholesterol', 'HDL Cholesterol', 'Systolic BP', 'Diabetes'],
        base_value: 0.3,
        plot_data: {
          data: [
            {
              x: ['Age', 'Total Cholesterol', 'HDL Cholesterol', 'Systolic BP', 'Diabetes'],
              y: [0.15, 0.25, 0.18, 0.20, 0.22],
              type: 'bar',
              marker: {
                color: ['green', 'red', 'red', 'red', 'red']
              }
            }
          ],
          layout: {
            title: 'SHAP Feature Importance - Risk Prediction',
            xaxis: { title: 'Features' },
            yaxis: { title: 'Impact on Risk Score' }
          }
        }
      },
      model_versions: {
        orchestrator: '2.0.0',
        risk_model: 'CardioRisk_v1.2.1',
        llm_model: 'MedLLM_v2.0.0'
      },
      timestamp: new Date().toISOString()
    };
  }
}

// Create singleton instance
const apiService = new MediSenseAPIService();

export default apiService;