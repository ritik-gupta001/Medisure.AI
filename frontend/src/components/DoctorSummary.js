import React from 'react';
import { Stethoscope, Brain, TrendingUp, FileText, Users, AlertTriangle, Target, Calendar } from 'lucide-react';

const DoctorSummary = ({ summary, isLoading = false }) => {
  if (isLoading) {
    return <DoctorSummaryLoader />;
  }

  if (!summary) {
    return null;
  }

  const getRiskLevelColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="medical-card">
      <div className="flex items-center mb-6">
        <Stethoscope className="h-6 w-6 text-medical-600 mr-3" />
        <h2 className="text-xl font-bold text-gray-900">Clinical Professional Summary</h2>
      </div>

      {/* Clinical Assessment */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <Brain className="h-5 w-5 mr-2 text-medical-600" />
          Clinical Assessment
        </h3>
        <div className="bg-gray-50 border-l-4 border-medical-400 p-4 rounded-lg">
          <p className="text-gray-900 leading-relaxed">{summary.clinical_assessment}</p>
        </div>
      </div>

      {/* Risk Stratification */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <Target className="h-5 w-5 mr-2 text-medical-600" />
          Risk Stratification
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-medical-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-600">Overall Risk</p>
            <div className="flex items-center mt-2">
              <span className={`risk-indicator ${getRiskLevelColor(summary.risk_stratification.overall_risk)}`}>
                {summary.risk_stratification.overall_risk}
              </span>
            </div>
          </div>
          <div className="bg-medical-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-600">10-Year CV Risk</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {(summary.risk_stratification['10_year_cv_risk'] * 100).toFixed(1)}%
            </p>
          </div>
          <div className="bg-medical-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-600">Risk Category</p>
            <div className="flex items-center mt-2">
              <span className={`risk-indicator ${getRiskLevelColor(summary.risk_stratification.risk_category)}`}>
                {summary.risk_stratification.risk_category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Differential Diagnosis */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-medical-600" />
          Differential Diagnosis
        </h3>
        <div className="space-y-3">
          {summary.differential_diagnosis.map((diagnosis, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{diagnosis.diagnosis}</h4>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-medical-500 h-2 rounded-full" 
                      style={{ width: `${diagnosis.probability * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {(diagnosis.probability * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Supporting Evidence:</p>
                <div className="flex flex-wrap gap-2">
                  {diagnosis.evidence.map((evidence, evidenceIndex) => (
                    <span 
                      key={evidenceIndex}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {evidence}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Treatment Recommendations */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-medical-600" />
          Treatment Recommendations
        </h3>
        <div className="space-y-3">
          {summary.treatment_recommendations.map((treatment, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{treatment.intervention}</h4>
                <div className="flex items-center space-x-2">
                  <span className={`risk-indicator ${getPriorityColor(treatment.priority)}`}>
                    {treatment.priority} Priority
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Level {treatment.evidence_level}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Follow-up Plan */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-medical-600" />
          Follow-up Plan
        </h3>
        <div className="space-y-2">
          {summary.follow_up_plan.map((item, index) => (
            <div key={index} className="flex items-start p-3 bg-medical-50 rounded-lg">
              <Calendar className="h-4 w-4 text-medical-600 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-medical-900">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence Citations */}
      {summary.evidence_citations && summary.evidence_citations.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-medical-600" />
            Evidence Base
          </h3>
          <div className="space-y-2">
            {summary.evidence_citations.map((citation, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">{citation.source}</p>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${citation.relevance * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">
                      {(citation.relevance * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                {citation.recommendation && (
                  <p className="text-sm text-gray-600 mt-1">{citation.recommendation}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Model Interpretation */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <Brain className="h-5 w-5 mr-2 text-medical-600" />
          AI Model Analysis
        </h3>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <p className="text-sm font-medium text-purple-700">Model Confidence</p>
              <p className="text-lg font-bold text-purple-900">
                {(summary.model_interpretation.model_confidence * 100).toFixed(0)}%
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-purple-700">Data Quality</p>
              <p className="text-lg font-bold text-purple-900">
                {summary.model_interpretation.data_quality}
              </p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-purple-700 mb-2">Primary Risk Drivers:</p>
            <div className="flex flex-wrap gap-2">
              {summary.model_interpretation.primary_risk_drivers.map((driver, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                >
                  {driver}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-3">
            <p className="text-sm text-purple-700">{summary.technical_notes}</p>
          </div>
        </div>
      </div>

      {/* Professional Disclaimer */}
      <div className="p-4 bg-gray-100 rounded-lg border-l-4 border-gray-400">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-gray-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-700">
              <strong>Clinical Decision Support:</strong> This AI analysis provides clinical decision support 
              and should be used in conjunction with clinical judgment. All treatment decisions should be 
              based on individual patient assessment and current clinical guidelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DoctorSummaryLoader = () => (
  <div className="medical-card">
    <div className="animate-pulse">
      <div className="flex items-center mb-6">
        <div className="w-6 h-6 bg-gray-300 rounded mr-3"></div>
        <div className="h-6 bg-gray-300 rounded w-48"></div>
      </div>
      
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i}>
            <div className="h-5 bg-gray-300 rounded w-32 mb-3"></div>
            <div className="h-20 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default DoctorSummary;