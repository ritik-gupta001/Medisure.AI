import React, { useState } from 'react';
import Dashboard from './components/Dashboard';

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setAnalysis(result.analysis);
    } catch (err) {
      setError('Failed to analyze PDF document. Please ensure the Python backend is running and the file is a valid PDF.');
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
      const response = await fetch(`${API_BASE_URL}/demo`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setAnalysis(result.analysis);
    } catch (err) {
      setError('Failed to load demo. Please ensure the Python backend is running.');
      console.error('Demo error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dashboard 
      analysis={analysis}
      onNewUpload={handleFileUpload}
      onDemo={handleDemo}
      loading={loading}
      error={error}
    />
  );
}

export default App;