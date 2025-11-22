import axios from 'axios';

// Use environment variable if available, otherwise use relative URL for production
const API_BASE_URL = process.env.REACT_APP_API_URL || (
  process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000'
);

class MediSenseAPIService {
  constructor() {
    this.apiClient = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('✅ API configured for:', API_BASE_URL || 'same origin');
  }

  async analyzeDocument(file, useLLM = true) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('use_llm', useLLM);

    try {
      const response = await this.apiClient.post('/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
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

  async getDemoAnalysis() {
    try {
      const response = await this.apiClient.get('/demo');
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

  async checkHealth() {
    try {
      const response = await this.apiClient.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('API health check failed');
    }
  }

  async checkAIStatus() {
    try {
      const response = await this.apiClient.get('/ai-status');
      return response.data;
    } catch (error) {
      return { api_key_configured: false };
    }
  }

  async chatWithAI(message, context = null, conversationId = null) {
    try {
      const response = await this.apiClient.post('/chat', {
        message: message,
        context: context,
        conversation_id: conversationId
      });

      return {
        success: true,
        response: response.data.response,
        sources: response.data.sources,
        conversation_id: response.data.conversation_id,
        timestamp: response.data.timestamp
      };
    } catch (error) {
      throw new Error(error.response?.data?.detail || error.message || 'Chat request failed');
    }
  }

  async getHealthInsights(analysisData) {
    try {
      const response = await this.apiClient.post('/health-insights', {
        analysis_data: analysisData
      });

      return {
        success: true,
        insights: response.data.insights
      };
    } catch (error) {
      throw new Error(error.response?.data?.detail || error.message || 'Health insights request failed');
    }
  }

  async generateMedicalReport(analysisData, patientInfo = null) {
    try {
      const response = await this.apiClient.post('/generate-report', {
        analysis_data: analysisData,
        patient_info: patientInfo
      });

      return {
        success: true,
        report: response.data.report
      };
    } catch (error) {
      throw new Error(error.response?.data?.detail || error.message || 'Medical report generation failed');
    }
  }
}

const apiService = new MediSenseAPIService();
export default apiService;
