import React from 'react';
import { User, Calendar, Activity, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const PatientSummary = ({ summary, isLoading = false }) => {
  if (isLoading) {
    return <PatientSummaryLoader />;
  }

  if (!summary) {
    return null;
  }

  const getRiskColor = (significance) => {
    switch (significance?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'moderate': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRiskIcon = (significance) => {
    switch (significance?.toLowerCase()) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'moderate': return <Clock className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="medical-card">
      <div className="flex items-center mb-6">
        <User className="h-6 w-6 text-medical-600 mr-3" />
        <h2 className="text-xl font-bold text-gray-900">Patient Summary</h2>
        <div className="ml-auto flex items-center text-sm text-gray-500">
          <Activity className="h-4 w-4 mr-1" />
          Confidence: {(summary.confidence_score * 100).toFixed(0)}%
        </div>
      </div>

      {/* Patient Demographics */}
      <div className="bg-medical-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-medical-600" />
          Patient Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Patient ID</p>
            <p className="text-lg font-semibold text-gray-900">{summary.demographics.patient_id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Age</p>
            <p className="text-lg font-semibold text-gray-900">{summary.demographics.age} years</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Sex</p>
            <p className="text-lg font-semibold text-gray-900">{summary.demographics.sex}</p>
          </div>
        </div>
      </div>

      {/* Clinical Findings */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-medical-600" />
          Key Test Results
        </h3>
        <div className="space-y-3">
          {summary.clinical_findings.map((finding, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className={`p-2 rounded-full mr-3 ${getRiskColor(finding.significance)}`}>
                  {getRiskIcon(finding.significance)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{finding.finding}</p>
                  <p className="text-sm text-gray-600">Normal range: {finding.normal_range}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{finding.value}</p>
                <span className={`risk-indicator ${finding.significance === 'High' ? 'risk-high' : 
                  finding.significance === 'Moderate' ? 'risk-moderate' : 'risk-low'}`}>
                  {finding.significance}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Factors */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Health Concerns</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {summary.risk_factors.map((factor, index) => (
            <div key={index} className="flex items-center p-2 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2 flex-shrink-0" />
              <span className="text-sm text-yellow-800">{factor}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Patient-Friendly Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">What This Means for You</h3>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
          <p className="text-blue-900 leading-relaxed">{summary.summary_text}</p>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Next Steps & Recommendations</h3>
        <div className="space-y-2">
          {summary.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-green-800">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Important Note */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg border-l-4 border-gray-400">
        <p className="text-sm text-gray-700">
          <strong>Important:</strong> This analysis is for informational purposes only. 
          Always consult with your healthcare provider before making any medical decisions 
          or changes to your treatment plan.
        </p>
      </div>
    </div>
  );
};

const PatientSummaryLoader = () => (
  <div className="medical-card">
    <div className="animate-pulse">
      <div className="flex items-center mb-6">
        <div className="w-6 h-6 bg-gray-300 rounded mr-3"></div>
        <div className="h-6 bg-gray-300 rounded w-40"></div>
      </div>
      
      <div className="bg-gray-100 rounded-lg p-4 mb-6">
        <div className="h-5 bg-gray-300 rounded w-32 mb-3"></div>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
              <div className="h-6 bg-gray-300 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    </div>
  </div>
);

export default PatientSummary;