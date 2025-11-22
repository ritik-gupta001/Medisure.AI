import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ThemedUploadView from './components/ThemedUploadView';
import { ThemeProvider } from './contexts/ThemeContext';
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
        console.log('✅ Demo analysis received:', result.data);
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
    <ThemeProvider>
      <div className="App">
        {currentView === 'upload' ? (
          <ThemedUploadView
            onUpload={handleFileUpload}
            loading={loading}
            error={error}
            apiHealth={apiHealth}
            onDemo={handleDemo}
          />
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
    </ThemeProvider>
  );
}

export default App;