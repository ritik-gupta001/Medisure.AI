import React from 'react';
import Plot from 'react-plotly.js';
import { BarChart3, TrendingUp, Info, Download } from 'lucide-react';

const SHAPVisualization = ({ shapData, isLoading = false }) => {
  if (isLoading) {
    return <SHAPVisualizationLoader />;
  }

  if (!shapData) {
    return null;
  }

  // Prepare data for interactive plot
  const plotData = shapData.plot_data?.data || [{
    x: shapData.feature_names || [],
    y: Object.values(shapData.feature_importance || {}),
    type: 'bar',
    marker: {
      color: Object.values(shapData.feature_importance || {}).map(val => 
        val > 0 ? '#ef4444' : '#10b981'
      )
    }
  }];

  const plotLayout = {
    title: {
      text: 'SHAP Feature Importance - Risk Prediction Model',
      font: { size: 16, color: '#374151' }
    },
    xaxis: { 
      title: 'Risk Factors',
      tickangle: -45,
      font: { size: 12 }
    },
    yaxis: { 
      title: 'Impact on Risk Score',
      font: { size: 12 }
    },
    plot_bgcolor: '#f9fafb',
    paper_bgcolor: '#ffffff',
    margin: { t: 60, b: 100, l: 60, r: 40 },
    height: 400
  };

  const plotConfig = {
    displayModeBar: true,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
    displaylogo: false,
    toImageButtonOptions: {
      format: 'png',
      filename: 'shap_analysis',
      height: 500,
      width: 800,
      scale: 1
    }
  };

  // Sort features by absolute importance for summary
  const sortedFeatures = Object.entries(shapData.feature_importance || {})
    .sort(([,a], [,b]) => Math.abs(b) - Math.abs(a));

  const downloadImage = (imageType) => {
    if (imageType === 'waterfall' && shapData.waterfall_plot) {
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${shapData.waterfall_plot}`;
      link.download = 'shap_waterfall_plot.png';
      link.click();
    } else if (imageType === 'summary' && shapData.summary_plot) {
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${shapData.summary_plot}`;
      link.download = 'shap_summary_plot.png';
      link.click();
    }
  };

  return (
    <div className="medical-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BarChart3 className="h-6 w-6 text-medical-600 mr-3" />
          <h2 className="text-xl font-bold text-gray-900">Model Interpretability (SHAP Analysis)</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Info className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500">AI Explanation</span>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">What is SHAP Analysis?</h3>
        <p className="text-blue-800 text-sm leading-relaxed">
          SHAP (SHapley Additive exPlanations) shows how each factor contributes to your risk score. 
          Red bars increase risk, green bars decrease risk. The longer the bar, the bigger the impact 
          on the final prediction.
        </p>
      </div>

      {/* Interactive Plot */}
      <div className="mb-6 bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-medical-600" />
          Interactive Feature Importance
        </h3>
        <div className="bg-white rounded-lg shadow-sm border">
          <Plot
            data={plotData}
            layout={plotLayout}
            config={plotConfig}
            style={{ width: '100%' }}
            useResizeHandler={true}
          />
        </div>
      </div>

      {/* Feature Importance Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Feature Impact Summary</h3>
        <div className="space-y-3">
          {sortedFeatures.map(([feature, importance], index) => {
            const isPositive = importance > 0;
            const absImportance = Math.abs(importance);
            const maxImportance = Math.max(...Object.values(shapData.feature_importance || {}));
            const widthPercent = (absImportance / Math.abs(maxImportance)) * 100;
            
            return (
              <div key={feature} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{feature}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-bold ${isPositive ? 'text-red-600' : 'text-green-600'}`}>
                      {importance > 0 ? '+' : ''}{importance.toFixed(3)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isPositive ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {isPositive ? 'Increases Risk' : 'Decreases Risk'}
                    </span>
                  </div>
                </div>
                
                {/* Visual bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${isPositive ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${widthPercent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Model Details */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Model Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-purple-700">Base Risk Score</p>
            <p className="text-2xl font-bold text-purple-900">{shapData.base_value?.toFixed(3)}</p>
            <p className="text-xs text-purple-600">Population average</p>
          </div>
          
          <div className="bg-medical-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-medical-700">Total Features</p>
            <p className="text-2xl font-bold text-medical-900">{shapData.feature_names?.length || 0}</p>
            <p className="text-xs text-medical-600">Risk factors analyzed</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-700">Max Impact</p>
            <p className="text-2xl font-bold text-gray-900">
              {Math.max(...Object.values(shapData.feature_importance || {})).toFixed(3)}
            </p>
            <p className="text-xs text-gray-600">Strongest risk factor</p>
          </div>
        </div>
      </div>

      {/* Static Plots Download */}
      {(shapData.waterfall_plot || shapData.summary_plot) && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Download Detailed Plots</h3>
          <div className="flex space-x-4">
            {shapData.waterfall_plot && (
              <button
                onClick={() => downloadImage('waterfall')}
                className="flex items-center px-4 py-2 bg-medical-500 text-white rounded-lg hover:bg-medical-600 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Waterfall Plot
              </button>
            )}
            
            {shapData.summary_plot && (
              <button
                onClick={() => downloadImage('summary')}
                className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Summary Plot
              </button>
            )}
          </div>
        </div>
      )}

      {/* Static Images Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {shapData.waterfall_plot && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Waterfall Plot</h4>
            <div className="bg-white border rounded-lg p-2">
              <img 
                src={`data:image/png;base64,${shapData.waterfall_plot}`}
                alt="SHAP Waterfall Plot"
                className="w-full h-auto rounded"
              />
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Shows how each feature contributes to the final prediction, starting from the base value.
            </p>
          </div>
        )}

        {shapData.summary_plot && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Summary Plot</h4>
            <div className="bg-white border rounded-lg p-2">
              <img 
                src={`data:image/png;base64,${shapData.summary_plot}`}
                alt="SHAP Summary Plot"
                className="w-full h-auto rounded"
              />
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Features ranked by importance. Red indicates higher risk, green indicates lower risk.
            </p>
          </div>
        )}
      </div>

      {/* Technical Note */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg border-l-4 border-gray-400">
        <h4 className="font-semibold text-gray-800 mb-2">Technical Information</h4>
        <p className="text-sm text-gray-700">
          SHAP values explain individual predictions by quantifying the contribution of each feature 
          to the difference between the current prediction and the average prediction. This analysis 
          helps understand which factors are most important for your specific risk assessment.
        </p>
      </div>
    </div>
  );
};

const SHAPVisualizationLoader = () => (
  <div className="medical-card">
    <div className="animate-pulse">
      <div className="flex items-center mb-6">
        <div className="w-6 h-6 bg-gray-300 rounded mr-3"></div>
        <div className="h-6 bg-gray-300 rounded w-64"></div>
      </div>
      
      <div className="h-96 bg-gray-200 rounded-lg mb-6"></div>
      
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    </div>
  </div>
);

export default SHAPVisualization;