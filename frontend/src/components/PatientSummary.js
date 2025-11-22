import React from 'react';
import { User, Calendar, Activity, TrendingUp, AlertTriangle, CheckCircle, Clock, Heart, Brain, Wind, Droplet, Zap, Shield } from 'lucide-react';

const PatientSummary = ({ summary, isLoading = false }) => {
  if (isLoading) {
    return <PatientSummaryLoader />;
  }

  if (!summary) {
    return null;
  }

  const getSeverityColor = (significance) => {
    const severityMap = {
      'critical': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: 'text-red-600' },
      'high': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: 'text-orange-600' },
      'moderate': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: 'text-yellow-600' },
      'mild': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: 'text-blue-600' },
      'low': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: 'text-green-600' },
      'normal': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', icon: 'text-teal-600' },
      'optimal': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: 'text-emerald-600' }
    };
    return severityMap[significance?.toLowerCase()] || severityMap['normal'];
  };

  const getRiskIcon = (significance) => {
    switch (significance?.toLowerCase()) {
      case 'critical': return <AlertTriangle className="h-5 w-5" />;
      case 'high': return <AlertTriangle className="h-5 w-5" />;
      case 'moderate': return <Clock className="h-5 w-5" />;
      case 'mild': return <Activity className="h-5 w-5" />;
      case 'low': return <CheckCircle className="h-5 w-5" />;
      case 'normal': return <CheckCircle className="h-5 w-5" />;
      case 'optimal': return <Shield className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const getCategoryIcon = (finding) => {
    const findingLower = finding?.toLowerCase() || '';
    
    // Cardiovascular
    if (findingLower.includes('heart') || findingLower.includes('blood pressure') || 
        findingLower.includes('bp') || findingLower.includes('pulse') || 
        findingLower.includes('cholesterol') || findingLower.includes('cardiac')) {
      return <Heart className="h-5 w-5 text-red-500" />;
    }
    
    // Neurological
    if (findingLower.includes('brain') || findingLower.includes('neuro') || 
        findingLower.includes('cognitive') || findingLower.includes('mental')) {
      return <Brain className="h-5 w-5 text-purple-500" />;
    }
    
    // Respiratory
    if (findingLower.includes('lung') || findingLower.includes('respiratory') || 
        findingLower.includes('breathing') || findingLower.includes('oxygen')) {
      return <Wind className="h-5 w-5 text-blue-500" />;
    }
    
    // Blood/Metabolic
    if (findingLower.includes('glucose') || findingLower.includes('diabetes') || 
        findingLower.includes('hemoglobin') || findingLower.includes('blood')) {
      return <Droplet className="h-5 w-5 text-red-400" />;
    }
    
    // Energy/Activity
    if (findingLower.includes('energy') || findingLower.includes('metabol') || 
        findingLower.includes('thyroid')) {
      return <Zap className="h-5 w-5 text-yellow-500" />;
    }
    
    // Default
    return <Activity className="h-5 w-5 text-teal-500" />;
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
          {summary.clinical_findings.map((finding, index) => {
            const colors = getSeverityColor(finding.significance);
            return (
              <div key={index} className={`flex items-start justify-between p-4 rounded-lg border-2 ${colors.border} ${colors.bg} transition-all hover:shadow-md`}>
                <div className="flex items-start flex-1">
                  <div className={`p-2 rounded-full mr-3 ${colors.icon} bg-white`}>
                    {getCategoryIcon(finding.finding)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <p className="font-semibold text-gray-900 mr-2">{finding.finding}</p>
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${colors.text} ${colors.bg} border ${colors.border}`}>
                        {finding.significance?.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Normal range: {finding.normal_range}</p>
                    <p className="text-xs text-gray-500 italic">Clinical significance: {finding.significance}</p>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="flex items-center justify-end mb-1">
                    <div className={`${colors.icon} mr-2`}>
                      {getRiskIcon(finding.significance)}
                    </div>
                    <p className="text-xl font-bold text-gray-900">{finding.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
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
        <div className="bg-teal-50 border-l-4 border-teal-400 p-4 rounded-lg">
          <p className="text-teal-900 leading-relaxed">{summary.summary_text}</p>
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