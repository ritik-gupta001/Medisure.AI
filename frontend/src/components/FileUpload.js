import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, AlertCircle, Sparkles, Cpu, Zap } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';

const FileUpload = ({ onUpload, isLoading = false, apiHealth = null }) => {
  const { currentColors } = useTheme();
  const [uploadError, setUploadError] = useState(null);
  const [analysisMode, setAnalysisMode] = useState('llm'); // 'llm' or 'legacy'

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setUploadError(null);
    
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      setUploadError(error.message);
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      console.log('📁 File selected:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
      onUpload(file, analysisMode === 'llm');
    }
  }, [onUpload, analysisMode]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject
  } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/tiff': ['.tiff'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
    disabled: isLoading
  });

  return (
    <div className="w-full space-y-4">
      {/* Analysis Mode Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Analysis Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          
          {/* LLM Analysis Option */}
          <div 
            className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
              analysisMode === 'llm' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => setAnalysisMode('llm')}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${
                analysisMode === 'llm' ? 'bg-blue-500' : 'bg-gray-400'
              }`}>
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">AI-Powered Analysis</h4>
                <p className="text-sm text-gray-600">
                  Advanced LLM with medical knowledge base
                </p>
                {apiHealth?.analyzers?.llm === 'needs_api_key' && (
                  <p className="text-xs text-amber-600 mt-1">
                    ⚠️ Requires API key configuration
                  </p>
                )}
              </div>
              <input
                type="radio"
                checked={analysisMode === 'llm'}
                onChange={() => setAnalysisMode('llm')}
                className="text-blue-500"
                disabled={apiHealth?.analyzers?.llm === 'needs_api_key'}
              />
            </div>
          </div>

          {/* Legacy Analysis Option */}
          <div 
            className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
              analysisMode === 'legacy' 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 hover:border-green-300'
            }`}
            onClick={() => setAnalysisMode('legacy')}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${
                analysisMode === 'legacy' ? 'bg-green-500' : 'bg-gray-400'
              }`}>
                <Cpu className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Rule-Based Analysis</h4>
                <p className="text-sm text-gray-600">
                  Traditional pattern matching approach
                </p>
                <p className="text-xs text-green-600 mt-1">
                  ✓ Always available
                </p>
              </div>
              <input
                type="radio"
                checked={analysisMode === 'legacy'}
                onChange={() => setAnalysisMode('legacy')}
                className="text-green-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={`
          upload-zone cursor-pointer
          ${isDragActive ? 'active border-medical-500 bg-medical-50' : ''}
          ${isDragReject ? 'border-red-400 bg-red-50' : ''}
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-500"></div>
              <div className="text-medical-600">
                <p className="text-lg font-medium">Processing Document...</p>
                <p className="text-sm text-gray-500">This may take a few moments</p>
              </div>
            </>
          ) : (
            <>
              <div className="p-3 bg-medical-100 rounded-full">
                {isDragReject ? (
                  <AlertCircle className="h-8 w-8 text-red-500" />
                ) : (
                  <Upload className="h-8 w-8 text-medical-600" />
                )}
              </div>
              
              <div className="text-center">
                <p className="text-lg font-medium text-gray-900">
                  {isDragActive ? (
                    isDragReject ? 'File type not supported' : 'Drop your medical document here'
                  ) : (
                    'Upload Medical Document'
                  )}
                </p>
                
                <p className="text-sm text-gray-500 mt-1">
                  Drag and drop or click to select
                </p>
                
                <p className="text-xs text-gray-400 mt-2">
                  Supports: PDF, JPG, PNG, TIFF, TXT (up to 50MB)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {uploadError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{uploadError}</p>
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>
          <strong>Supported formats:</strong> Medical reports (PDF), lab results, diagnostic images, clinical notes
        </p>
        <p className="mt-1">
          <strong>Privacy:</strong> All uploaded documents are processed securely and deleted after analysis
        </p>
      </div>
    </div>
  );
};

export default FileUpload;