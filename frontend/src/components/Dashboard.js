import React, { useState } from 'react';
import { MedicalIcons, MedicalGradients, HospitalLogo } from './MedicalIcons';
import VitalCharts from './VitalCharts';
import RiskGauge from './RiskGauge';
import AIChatInterface from './AIChatInterface';
import ThemeToggle from './ThemeToggle';
import DownloadReport from './DownloadReport';
import { useTheme } from '../contexts/ThemeContext';
import apiService from '../services/api';

const Dashboard = ({ analysis, onNewUpload, onDemo, loading, error }) => {
  const { currentColors } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadHistory, setUploadHistory] = useState([]);
  const [aiStatus, setAiStatus] = useState(null);
  const [healthInsights, setHealthInsights] = useState(null);

  // Check API health and AI status on component mount
  React.useEffect(() => {
    const checkServices = async () => {
      try {
        const [health, aiStatusData] = await Promise.all([
          apiService.checkHealth(),
          apiService.checkAIStatus()
        ]);
        setApiHealth(health);
        setAiStatus(aiStatusData);
      } catch (error) {
        console.error('Failed to check API services:', error);
      }
    };
    checkServices();
  }, []);

  const addToHistory = (analysisData) => {
    const historyItem = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      summary: analysisData.patient_summary?.key_findings?.[0] || 'Medical Analysis',
      data: analysisData,
      analysisType: analysisData.analysis_type || 'Unknown'
    };
    setUploadHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Keep last 10
  };

  const generateHealthInsights = async (analysisData) => {
    try {
      const insights = await apiService.getHealthInsights(analysisData);
      setHealthInsights(insights.insights);
    } catch (error) {
      console.error('Failed to generate health insights:', error);
    }
  };

  React.useEffect(() => {
    if (analysis) {
      addToHistory(analysis);
    }
  }, [analysis]);

  return (
    <div style={{
      minHeight: '100vh',
      background: currentColors.gradient,
      display: 'flex'
    }}>
      {/* Left Sidebar */}
      <div style={{
        width: '320px',
        background: `rgba(${currentColors.surface.slice(1)}, 0.95)`,
        backdropFilter: 'blur(10px)',
        borderRight: `1px solid ${currentColors.border}`,
        boxShadow: `4px 0 24px ${currentColors.shadow}`,
        padding: '24px',
        overflowY: 'auto'
      }}>
        {/* Logo and Theme Toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
          paddingBottom: '24px',
          borderBottom: `1px solid ${currentColors.border}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <HospitalLogo />
            <div style={{ 
              borderLeft: `2px solid ${currentColors.border}`, 
              height: '48px',
              margin: '0 4px'
            }} />
            <MedicalIcons.Brain />
            <div style={{marginLeft: '12px'}}>
              <h2 style={{
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: currentColors.text.primary, 
                margin: 0,
                background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                MediSense AI
              </h2>
              <p style={{fontSize: '0.8rem', color: currentColors.text.secondary, margin: 0}}>
                🏥 Advanced Medical Analysis Platform
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Upload Section */}
        <div style={{marginBottom: '32px'}}>
          <h3 style={{fontSize: '1.1rem', fontWeight: '600', color: currentColors.text.primary, marginBottom: '16px'}}>
            Upload New Report
          </h3>
          <div style={{
            border: `2px dashed ${currentColors.border}`,
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            background: currentColors.surface
          }}>
            <div style={{display: 'flex', justifyContent: 'center', marginBottom: '12px'}}>
              <MedicalIcons.DocumentIcon />
            </div>
            <input
              type="file"
              accept=".pdf"
              onChange={onNewUpload}
              style={{display: 'none'}}
              id="dashboard-file-upload"
              disabled={loading}
            />
            <label
              htmlFor="dashboard-file-upload"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: MedicalGradients.primary,
                color: 'white',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                opacity: loading ? 0.5 : 1,
                boxShadow: '0 2px 4px rgba(102, 126, 234, 0.3)',
                marginBottom: '8px'
              }}
            >
              <MedicalIcons.UploadIcon />
              {loading ? 'Analyzing...' : 'Choose PDF'}
            </label>
            <div style={{fontSize: '0.8rem', color: '#9ca3af', marginBottom: '8px'}}>or</div>
            <button
              onClick={onDemo}
              disabled={loading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: MedicalGradients.success,
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                opacity: loading ? 0.5 : 1,
                boxShadow: '0 2px 4px rgba(132, 250, 176, 0.3)'
              }}
            >
              <MedicalIcons.DemoIcon />
              Try Demo
            </button>
          </div>
        </div>

        {/* Download Report Section */}
        {analysis && (
          <div style={{marginBottom: '32px'}}>
            <h3 style={{fontSize: '1.1rem', fontWeight: '600', color: currentColors.text.primary, marginBottom: '16px'}}>
              Download Report
            </h3>
            <div style={{
              padding: '16px',
              background: currentColors.surface,
              borderRadius: '12px',
              border: `1px solid ${currentColors.border}`,
              boxShadow: `0 2px 8px ${currentColors.shadow}`
            }}>
              <DownloadReport 
                analysis={analysis} 
                patientName="Patient Report" 
                style={{ justifyContent: 'center' }}
              />
            </div>
          </div>
        )}

        {/* Upload History */}
        <div style={{marginBottom: '24px'}}>
          <h3 style={{fontSize: '1.1rem', fontWeight: '600', color: currentColors.text.primary, marginBottom: '16px'}}>
            Recent Analyses
          </h3>
          <div style={{maxHeight: '400px', overflowY: 'auto'}}>
            {uploadHistory.length === 0 ? (
              <div style={{
                padding: '16px',
                textAlign: 'center',
                color: currentColors.text.secondary,
                fontSize: '0.9rem',
                background: currentColors.surface,
                borderRadius: '8px'
              }}>
                No analyses yet
              </div>
            ) : (
              uploadHistory.map((item, index) => (
                <div key={item.id} style={{
                  padding: '12px',
                  marginBottom: '8px',
                  background: index === 0 ? 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)' : '#f9fafb',
                  borderRadius: '8px',
                  border: index === 0 ? '1px solid #0ea5e9' : '1px solid #e5e7eb',
                  cursor: 'pointer'
                }}>
                  <div style={{
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    color: index === 0 ? '#0369a1' : '#374151',
                    marginBottom: '4px'
                  }}>
                    {index === 0 && <span style={{color: '#059669', marginRight: '4px'}}>● </span>}
                    {item.timestamp}
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    color: '#6b7280',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {item.summary}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{marginTop: 'auto'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            {[
              {key: 'overview', label: 'Overview', icon: MedicalIcons.Analysis},
              {key: 'vitals', label: 'Vital Charts', icon: MedicalIcons.HeartRate},
              {key: 'conditions', label: 'Conditions', icon: MedicalIcons.Stethoscope},
              {key: 'recommendations', label: 'Recommendations', icon: MedicalIcons.RecommendationIcon},
              {key: 'chat', label: 'AI Assistant', icon: MedicalIcons.Brain, 
               isNew: aiStatus?.api_key_configured, 
               disabled: false} // Always enable chat tab
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                disabled={tab.disabled}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  background: activeTab === tab.key ? MedicalGradients.primary : 'transparent',
                  color: activeTab === tab.key ? 'white' : tab.disabled ? '#9ca3af' : '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: tab.disabled ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  textAlign: 'left',
                  opacity: tab.disabled ? 0.5 : 1,
                  position: 'relative'
                }}
              >
                <tab.icon />
                {tab.label}
                {tab.isNew && (
                  <span style={{
                    background: '#10b981',
                    color: 'white',
                    fontSize: '0.7rem',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    marginLeft: 'auto'
                  }}>
                    NEW
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{flex: 1, padding: '24px', overflowY: 'auto'}}>
        {loading && (
          <div style={{
            background: currentColors.surface,
            borderRadius: '16px',
            padding: '40px',
            textAlign: 'center',
            boxShadow: `0 10px 15px -3px ${currentColors.shadow}`,
            backdropFilter: 'blur(10px)'
          }}>
            <MedicalIcons.LoadingIcon />
            <p style={{marginTop: '16px', fontSize: '1.1rem', color: currentColors.text.secondary}}>
              Analyzing your medical report with AI intelligence...
            </p>
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(254, 242, 242, 0.95)',
            border: '1px solid #fca5a5',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '20px',
            boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <MedicalIcons.ErrorIcon />
              <span style={{color: '#991b1b', fontWeight: '500', marginLeft: '12px'}}>{error}</span>
            </div>
          </div>
        )}

        {!analysis && !loading && !error && (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)'
          }}>
            <MedicalIcons.Brain />
            <h2 style={{fontSize: '2rem', color: '#1f2937', marginTop: '20px'}}>
              Welcome to MediSure AI
            </h2>
            <p style={{fontSize: '1.1rem', color: '#6b7280', marginTop: '12px'}}>
              Upload a medical report or try our demo to get started with intelligent medical analysis
            </p>
          </div>
        )}

        {analysis && (
          <div>
            {activeTab === 'overview' && (
              <DashboardOverview 
                analysis={analysis} 
                onGenerateInsights={() => generateHealthInsights(analysis)}
                healthInsights={healthInsights}
              />
            )}
            {activeTab === 'vitals' && (
              <VitalCharts analysis={analysis} />
            )}
            {activeTab === 'conditions' && (
              <ConditionsPanel analysis={analysis} />
            )}
            {activeTab === 'recommendations' && (
              <RecommendationsPanel analysis={analysis} />
            )}
            {activeTab === 'chat' && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{marginBottom: '20px'}}>
                  <h2 style={{fontSize: '1.8rem', color: '#1f2937', marginBottom: '8px'}}>
                    AI Medical Assistant
                  </h2>
                  <p style={{color: '#6b7280'}}>
                    Ask questions about your medical report, get health advice, or discuss your results with our AI assistant.
                  </p>
                </div>
                <AIChatInterface 
                  analysisContext={analysis}
                  onInsightGenerated={setHealthInsights}
                />
              </div>
            )}
          </div>
        )}

        {/* Show AI Chat even without analysis */}
        {!analysis && activeTab === 'chat' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{marginBottom: '20px'}}>
              <h2 style={{fontSize: '1.8rem', color: '#1f2937', marginBottom: '8px'}}>
                AI Medical Assistant
              </h2>
              <p style={{color: '#6b7280'}}>
                Get answers to your health questions, learn about medical conditions, or discuss general health topics.
              </p>
            </div>
            <AIChatInterface />
          </div>
        )}
      </div>
    </div>
  );
};

// Dashboard Overview Component
const DashboardOverview = ({ analysis }) => {
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div>
            <h1 style={{fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0}}>
              Medical Analysis Overview
            </h1>
            <p style={{color: '#6b7280', fontSize: '1rem', margin: '4px 0 0 0'}}>
              Comprehensive AI-powered health insights
            </p>
          </div>
          <MedicalIcons.SuccessIcon />
        </div>
      </div>

      {/* Risk Assessment Dashboard */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px'
      }}>
        <RiskGauge analysis={analysis} />
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{fontSize: '1.3rem', fontWeight: '600', color: '#1f2937', marginBottom: '16px'}}>
            Key Findings Summary
          </h3>
          {/* Handle both LLM and legacy analysis structures */}
          {(analysis.findings || analysis.patient_summary?.key_findings || []).slice(0, 3).map((finding, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'flex-start',
              padding: '12px',
              marginBottom: '8px',
              background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
              borderRadius: '8px'
            }}>
              <MedicalIcons.NumberBadge number={index + 1} />
              <div style={{marginLeft: '12px', flex: 1}}>
                <p style={{fontWeight: '500', color: '#374151', margin: '0 0 4px 0'}}>
                  {finding.description || finding.name || finding.finding || 'Medical Finding'}
                </p>
                <p style={{color: '#6b7280', fontSize: '0.9rem', margin: 0}}>
                  {finding.interpretation || finding.value || finding.detail || 'Analysis available'}
                </p>
                {/* Show severity if available */}
                {finding.severity && (
                  <span style={{
                    display: 'inline-block',
                    marginTop: '4px',
                    padding: '2px 8px',
                    fontSize: '0.75rem',
                    borderRadius: '12px',
                    background: finding.severity === 'critical' ? '#fee2e2' : finding.severity === 'moderate' ? '#fef3c7' : '#f0fdf4',
                    color: finding.severity === 'critical' ? '#dc2626' : finding.severity === 'moderate' ? '#d97706' : '#15803d'
                  }}>
                    {finding.severity}
                  </span>
                )}
              </div>
            </div>
          ))}
          
          {/* Show message if no findings */}
          {!(analysis.findings || analysis.patient_summary?.key_findings)?.length && (
            <div style={{
              padding: '16px',
              background: '#f3f4f6',
              borderRadius: '8px',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              {analysis.summary || 'Analysis completed - detailed results available in other tabs'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Conditions Panel Component
const ConditionsPanel = ({ analysis }) => {
  // Handle both LLM and legacy analysis structures
  const conditions = analysis.findings || analysis.patient_summary?.detected_conditions || [];
  
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      padding: '32px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)'
    }}>
      <h2 style={{fontSize: '1.8rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px'}}>
        Medical Findings & Conditions
      </h2>
      
      {conditions.length > 0 ? conditions.map((condition, index) => (
        <div key={index} style={{
          marginBottom: '20px',
          padding: '20px',
          background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
          borderRadius: '12px',
          border: '1px solid #f59e0b'
        }}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
            <h4 style={{fontWeight: '600', color: '#1f2937', margin: 0, fontSize: '1.1rem'}}>
              {condition.name || condition.description || condition.finding || 'Medical Finding'}
            </h4>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <span style={{
                padding: '6px 12px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: '500',
                background: (condition.confidence === 'High' || condition.severity === 'High') ? '#fee2e2' : '#fef3c7',
                color: (condition.confidence === 'High' || condition.severity === 'High') ? '#991b1b' : '#92400e'
              }}>
                {condition.confidence || condition.severity || 'Detected'}
              </span>
            </div>
          </div>
          <p style={{color: '#374151', marginBottom: '12px', lineHeight: '1.5'}}>
            {condition.explanation || condition.interpretation || condition.detail || 'Medical analysis available'}
          </p>
          {(condition.management || condition.recommendation) && (
            <div style={{
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '8px',
              fontSize: '0.9rem',
              color: '#4b5563'
            }}>
              <strong>Management:</strong> {condition.management || condition.recommendation}
            </div>
          )}
        </div>
      )) : (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '1.1rem'
        }}>
          No specific conditions detected in the analysis
        </div>
      )}
    </div>
  );
};

// Recommendations Panel Component
const RecommendationsPanel = ({ analysis }) => {
  // Handle both LLM and legacy analysis structures
  const recommendations = analysis.recommendations || analysis.patient_summary?.recommendations || [];
  const lifestyleModifications = analysis.lifestyle_modifications || analysis.patient_summary?.lifestyle_modifications || [];
  
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{fontSize: '1.3rem', fontWeight: '600', color: '#1f2937', marginBottom: '16px'}}>
            Personalized Recommendations
          </h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            {recommendations.map((rec, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'flex-start',
                padding: '16px',
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                borderRadius: '12px',
                border: '1px solid #bbf7d0'
              }}>
                <MedicalIcons.CheckIcon />
                <span style={{marginLeft: '12px', color: '#1f2937'}}>
                  {typeof rec === 'string' ? rec : rec.description || rec.recommendation || String(rec)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lifestyle Modifications */}
      {lifestyleModifications.length > 0 && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{fontSize: '1.3rem', fontWeight: '600', color: '#1f2937', marginBottom: '16px'}}>
            Lifestyle Modifications
          </h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            {lifestyleModifications.map((mod, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'flex-start',
                padding: '16px',
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                borderRadius: '12px',
                border: '1px solid #bfdbfe'
              }}>
                <MedicalIcons.LifestyleIcon />
                <span style={{marginLeft: '12px', color: '#1f2937'}}>
                  {typeof mod === 'string' ? mod : mod.description || mod.modification || String(mod)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Show message if no recommendations */}
      {recommendations.length === 0 && lifestyleModifications.length === 0 && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '1.1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          No specific recommendations available in the current analysis
        </div>
      )}
    </div>
  );
};

export default Dashboard;