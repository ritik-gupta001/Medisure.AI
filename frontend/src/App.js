import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import FileUpload from './components/FileUpload';
import apiService from './services/api';

function App() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiHealth, setApiHealth] = useState(null);
  const [currentView, setCurrentView] = useState('upload'); // 'upload' or 'dashboard'

  // Check API health on app load
  useEffect(() => {
    const checkAPIHealth = async () => {
      try {
        const health = await apiService.checkHealth();
        setApiHealth(health);
      } catch (error) {
        console.error('Failed to check API health:', error);
        setApiHealth({ status: 'error' });
      }
    };
    checkAPIHealth();
  }, []);

  const handleFileUpload = async (file, useLLM = true) => {
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await apiService.analyzeDocument(file, useLLM);
      
      if (result.success && result.data) {
        console.log('✅ Analysis result received:', result.data);
        // Extract analysis from the response structure: {success: true, analysis: {...}}
        const analysisData = result.data.analysis || result.data;
        setAnalysis(analysisData);
        setCurrentView('dashboard');
      } else {
        throw new Error(result.error || 'Analysis failed');
      }
    } catch (err) {
      setError(`Failed to analyze document: ${err.message}`);
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    
    try {
      const result = await apiService.getDemoAnalysis();
      
      if (result.success && result.data) {
        console.log('✅ Demo analysis result received:', result.data);
        // Extract analysis from the response structure: {success: true, analysis: {...}}
        const analysisData = result.data.analysis || result.data;
        setAnalysis(analysisData);
        setCurrentView('dashboard');
      } else {
        throw new Error(result.error || 'Demo failed');
      }
    } catch (err) {
      setError(`Demo failed: ${err.message}`);
      console.error('Demo error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewUpload = () => {
    setCurrentView('upload');
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="App">
      {currentView === 'upload' ? (
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            maxWidth: '800px',
            width: '100%',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '10px'
              }}>
                MediSure AI
              </h1>
              <p style={{
                fontSize: '1.2rem',
                color: '#6b7280',
                marginBottom: '10px'
              }}>
                Advanced Medical Document Analysis with AI
              </p>
              {apiHealth && (
                <div style={{
                  fontSize: '0.9rem',
                  color: apiHealth.analyzers?.llm === 'ready' ? '#10b981' : '#f59e0b',
                  marginBottom: '20px'
                }}>
                  {apiHealth.analyzers?.llm === 'ready' ? 
                    '🚀 AI-Powered Analysis Available' : 
                    '⚠️ Using Legacy Analysis (Configure API keys for AI features)'}
                </div>
              )}
            </div>

            <FileUpload 
              onUpload={handleFileUpload}
              isLoading={loading}
              apiHealth={apiHealth}
            />

            {error && (
              <div style={{
                marginTop: '20px',
                padding: '15px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                color: '#dc2626'
              }}>
                {error}
              </div>
            )}

            <div style={{
              marginTop: '30px',
              textAlign: 'center'
            }}>
              <button
                onClick={handleDemo}
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  transition: 'all 0.2s'
                }}
              >
                {loading ? 'Processing...' : 'Try Demo Report'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Dashboard 
          analysis={analysis}
          onNewUpload={handleNewUpload}
          onDemo={handleDemo}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
}

export default App;