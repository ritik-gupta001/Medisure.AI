import React, { useState } from 'react';
import { MedicalIcons, MedicalGradients } from './MedicalIcons';
import VitalCharts from './VitalCharts';
import RiskGauge from './RiskGauge';

const Dashboard = ({ analysis, onNewUpload, onDemo, loading, error }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadHistory, setUploadHistory] = useState([]);

  const addToHistory = (analysisData) => {
    const historyItem = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      summary: analysisData.patient_summary?.key_findings?.[0] || 'Medical Analysis',
      data: analysisData
    };
    setUploadHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Keep last 10
  };

  React.useEffect(() => {
    if (analysis) {
      addToHistory(analysis);
    }
  }, [analysis]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)',
      display: 'flex'
    }}>
      {/* Left Sidebar */}
      <div style={{
        width: '320px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.1)',
        padding: '24px',
        overflowY: 'auto'
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '32px',
          paddingBottom: '24px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <MedicalIcons.Brain />
          <div style={{marginLeft: '12px'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0}}>
              MediSense AI
            </h2>
            <p style={{fontSize: '0.8rem', color: '#6b7280', margin: 0}}>
              Medical Analysis Dashboard
            </p>
          </div>
        </div>

        {/* Upload Section */}
        <div style={{marginBottom: '32px'}}>
          <h3 style={{fontSize: '1.1rem', fontWeight: '600', color: '#374151', marginBottom: '16px'}}>
            Upload New Report
          </h3>
          <div style={{
            border: '2px dashed #cbd5e1',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
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

        {/* Upload History */}
        <div style={{marginBottom: '24px'}}>
          <h3 style={{fontSize: '1.1rem', fontWeight: '600', color: '#374151', marginBottom: '16px'}}>
            Recent Analyses
          </h3>
          <div style={{maxHeight: '400px', overflowY: 'auto'}}>
            {uploadHistory.length === 0 ? (
              <div style={{
                padding: '16px',
                textAlign: 'center',
                color: '#9ca3af',
                fontSize: '0.9rem',
                background: '#f9fafb',
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
              {key: 'recommendations', label: 'Recommendations', icon: MedicalIcons.RecommendationIcon}
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  background: activeTab === tab.key ? MedicalGradients.primary : 'transparent',
                  color: activeTab === tab.key ? 'white' : '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  textAlign: 'left'
                }}
              >
                <tab.icon />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{flex: 1, padding: '24px', overflowY: 'auto'}}>
        {loading && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <MedicalIcons.LoadingIcon />
            <p style={{marginTop: '16px', fontSize: '1.1rem', color: '#4b5563'}}>
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
              Welcome to MediSense AI
            </h2>
            <p style={{fontSize: '1.1rem', color: '#6b7280', marginTop: '12px'}}>
              Upload a medical report or try our demo to get started with intelligent medical analysis
            </p>
          </div>
        )}

        {analysis && (
          <div>
            {activeTab === 'overview' && (
              <DashboardOverview analysis={analysis} />
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
          {analysis.patient_summary?.key_findings?.slice(0, 3).map((finding, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'flex-start',
              padding: '12px',
              marginBottom: '8px',
              background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
              borderRadius: '8px'
            }}>
              <MedicalIcons.NumberBadge number={index + 1} />
              <span style={{marginLeft: '12px', color: '#374151', fontSize: '0.9rem'}}>
                {typeof finding === 'string' ? finding : String(finding)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Conditions Panel Component
const ConditionsPanel = ({ analysis }) => {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      padding: '32px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)'
    }}>
      <h2 style={{fontSize: '1.8rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px'}}>
        Detected Medical Conditions
      </h2>
      
      {analysis.patient_summary?.detected_conditions?.map((condition, index) => (
        <div key={index} style={{
          marginBottom: '20px',
          padding: '20px',
          background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
          borderRadius: '12px',
          border: '1px solid #f59e0b'
        }}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
            <h4 style={{fontWeight: '600', color: '#1f2937', margin: 0, fontSize: '1.1rem'}}>
              {condition.name}
            </h4>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <span style={{
                padding: '6px 12px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: '500',
                background: condition.confidence === 'High' ? '#fee2e2' : '#fef3c7',
                color: condition.confidence === 'High' ? '#991b1b' : '#92400e'
              }}>
                {condition.confidence} Confidence
              </span>
            </div>
          </div>
          <p style={{color: '#374151', marginBottom: '12px', lineHeight: '1.5'}}>
            {condition.explanation}
          </p>
          {condition.management && (
            <div style={{
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '8px',
              fontSize: '0.9rem',
              color: '#4b5563'
            }}>
              <strong>Management:</strong> {condition.management}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Recommendations Panel Component
const RecommendationsPanel = ({ analysis }) => {
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
      {/* Recommendations */}
      {analysis.patient_summary?.recommendations && (
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
            {analysis.patient_summary.recommendations.map((rec, index) => (
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
                  {typeof rec === 'string' ? rec : String(rec)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lifestyle Modifications */}
      {analysis.patient_summary?.lifestyle_modifications && (
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
            {analysis.patient_summary.lifestyle_modifications.map((mod, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'flex-start',
                padding: '16px',
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                borderRadius: '12px',
                border: '1px solid #bfdbfe'
              }}>
                <MedicalIcons.LifestyleIcon />
                <span style={{marginLeft: '12px', color: '#1f2937'}}>{mod}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;