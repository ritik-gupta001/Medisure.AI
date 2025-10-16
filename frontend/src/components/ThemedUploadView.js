import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import FileUpload from './FileUpload';

const ThemedUploadView = ({ onUpload, loading, error, apiHealth, onDemo }) => {
  const { currentColors } = useTheme();

  return (
    <div style={{
      minHeight: '100vh',
      background: currentColors.gradient,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* Theme Toggle - Positioned absolutely */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 10
      }}>
        <ThemeToggle />
      </div>

      <div style={{
        maxWidth: '800px',
        width: '100%',
        background: currentColors.surface,
        borderRadius: '20px',
        padding: '40px',
        boxShadow: `0 20px 25px -5px ${currentColors.shadow}`,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${currentColors.border}`
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
            color: currentColors.text.secondary,
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
          onUpload={onUpload}
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
          padding: '20px',
          background: currentColors.surfaceVariant,
          borderRadius: '12px',
          border: `1px solid ${currentColors.border}`
        }}>
          <button
            onClick={onDemo}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 24px',
              background: loading ? currentColors.border : 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
              color: '#ffffff',
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
  );
};

export default ThemedUploadView;