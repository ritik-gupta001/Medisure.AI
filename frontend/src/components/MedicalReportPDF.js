import React, { useState } from 'react';
import { FileText, Download, CheckCircle, Info } from 'lucide-react';
import api from '../services/api';

const MedicalReportPDF = ({ analysis, patientInfo = {}, style = {} }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [medicalReport, setMedicalReport] = useState(null);
  const [showPatientExplanation, setShowPatientExplanation] = useState(false);

  const generateProfessionalReport = async () => {
    setIsGenerating(true);
    try {
      const response = await api.post('/generate-report', {
        analysis_data: analysis,
        patient_info: patientInfo
      });
      
      if (response.data.success) {
        setMedicalReport(response.data.report);
        downloadMedicalReportPDF(response.data.report);
      }
    } catch (error) {
      console.error('Failed to generate medical report:', error);
      // Fallback to basic report generation
      generateBasicReport();
    } finally {
      setIsGenerating(false);
    }
  };

  const generateBasicReport = () => {
    const report = createBasicMedicalReport(analysis, patientInfo);
    setMedicalReport(report);
    downloadMedicalReportPDF(report);
  };

  const createBasicMedicalReport = (analysisData, patientData) => {
    return {
      medical_report: {
        subjective: "Patient presents for medical document review and analysis.",
        objective: {
          vital_signs: "As documented in medical records",
          laboratory_findings: "See detailed findings below",
          clinical_observations: "Based on submitted medical documentation"
        },
        assessment: {
          primary_diagnosis: analysisData?.summary || "Comprehensive medical analysis completed",
          differential_diagnosis: ["Further clinical correlation recommended"],
          risk_stratification: analysisData?.risk_assessment?.overall_risk || "To be determined",
          prognostic_indicators: "Dependent on clinical context"
        },
        plan: {
          immediate_interventions: analysisData?.recommendations?.slice(0, 3) || ["Review results with healthcare provider"],
          pharmacological: ["As directed by healthcare provider"],
          non_pharmacological: ["Maintain healthy lifestyle practices"],
          monitoring: ["Regular follow-up as recommended"],
          referrals: ["Specialist consultation if indicated"],
          patient_education: ["Discuss results with medical team"]
        }
      },
      patient_explanation: {
        overview: "Your medical documents have been analyzed. The results provide insights into your health status based on available information.",
        what_this_means: "The results show various health indicators evaluated against standard medical ranges.",
        action_steps: "Schedule an appointment with your healthcare provider to discuss these results.",
        when_to_worry: "Seek immediate medical attention for: severe chest pain, difficulty breathing, sudden weakness, or severe headache.",
        positive_aspects: "Your proactive approach to understanding your health is commendable."
      },
      visual_coding: {
        severity_colors: {
          critical: "#DC2626",
          high: "#EF4444",
          moderate: "#F59E0B",
          mild: "#FCD34D",
          normal: "#10B981",
          optimal: "#059669"
        }
      },
      timestamp: new Date().toISOString(),
      report_id: `MR-${Date.now()}`
    };
  };

  const downloadMedicalReportPDF = (report) => {
    const htmlContent = generateMedicalReportHTML(report);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Download HTML file
    const link = document.createElement('a');
    link.href = url;
    const patientName = patientInfo?.name || 'Patient';
    link.download = `Medical-Report-${patientName.replace(/\s+/g, '-')}-${report.report_id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Open for printing
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 500);
      };
    }
    
    URL.revokeObjectURL(url);
  };

  const generateMedicalReportHTML = (report) => {
    const patientName = patientInfo?.name || 'Patient';
    const patientAge = patientInfo?.age || 'N/A';
    const patientSex = patientInfo?.sex || 'N/A';
    const reportDate = new Date(report.timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const medReport = report.medical_report;
    const patientExp = report.patient_explanation;
    const colors = report.visual_coding?.severity_colors || {};

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Medical Analysis Report - ${patientName}</title>
    <style>
        @media print {
            .no-print { display: none; }
            .page-break { page-break-before: always; }
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: white;
            padding: 40px;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .header {
            border-bottom: 4px solid #14b8a6;
            padding-bottom: 20px;
            margin-bottom: 30px;
            background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
            padding: 30px;
            border-radius: 10px;
        }
        
        .header h1 {
            color: #0f766e;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
        }
        
        .header-info {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-top: 20px;
        }
        
        .header-info-item {
            background: white;
            padding: 12px;
            border-radius: 6px;
            border-left: 3px solid #14b8a6;
        }
        
        .header-info-item strong {
            color: #0f766e;
            display: block;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .header-info-item span {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
        }
        
        .section {
            margin: 30px 0;
            padding: 25px;
            background: #f9fafb;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }
        
        .section-title {
            font-size: 20px;
            font-weight: 700;
            color: #0f766e;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #14b8a6;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .subsection {
            margin: 20px 0;
        }
        
        .subsection-title {
            font-size: 16px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 10px;
        }
        
        .finding-item {
            background: white;
            padding: 15px;
            margin: 10px 0;
            border-radius: 6px;
            border-left: 4px solid #14b8a6;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .finding-item.critical {
            border-left-color: ${colors.critical || '#DC2626'};
            background: #fef2f2;
        }
        
        .finding-item.high {
            border-left-color: ${colors.high || '#EF4444'};
            background: #fff7ed;
        }
        
        .finding-item.moderate {
            border-left-color: ${colors.moderate || '#F59E0B'};
            background: #fffbeb;
        }
        
        .finding-item.normal {
            border-left-color: ${colors.normal || '#10B981'};
            background: #f0fdf4;
        }
        
        .soap-section {
            margin: 15px 0;
        }
        
        .soap-label {
            display: inline-block;
            background: #0f766e;
            color: white;
            padding: 4px 12px;
            border-radius: 4px;
            font-weight: 600;
            font-size: 14px;
            margin-bottom: 8px;
        }
        
        .recommendation-list {
            list-style: none;
            padding: 0;
        }
        
        .recommendation-list li {
            padding: 10px 15px;
            margin: 8px 0;
            background: white;
            border-left: 3px solid #14b8a6;
            border-radius: 4px;
        }
        
        .recommendation-list li:before {
            content: "✓ ";
            color: #14b8a6;
            font-weight: bold;
            margin-right: 8px;
        }
        
        .patient-friendly {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            padding: 25px;
            border-radius: 8px;
            border: 2px solid #3b82f6;
            margin: 30px 0;
        }
        
        .patient-friendly h3 {
            color: #1e40af;
            font-size: 18px;
            margin-bottom: 15px;
        }
        
        .patient-friendly p {
            margin: 12px 0;
            line-height: 1.8;
        }
        
        .warning-box {
            background: #fef2f2;
            border: 2px solid #ef4444;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .warning-box h4 {
            color: #dc2626;
            margin-bottom: 10px;
            font-size: 16px;
        }
        
        .positive-box {
            background: #f0fdf4;
            border: 2px solid #10b981;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .positive-box h4 {
            color: #059669;
            margin-bottom: 10px;
            font-size: 16px;
        }
        
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
        }
        
        .disclaimer {
            background: #fef3c7;
            border: 2px solid #f59e0b;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
            font-size: 14px;
        }
        
        .disclaimer strong {
            color: #92400e;
            display: block;
            margin-bottom: 10px;
        }
        
        @page {
            margin: 2cm;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏥 MediSense AI - Professional Medical Analysis Report</h1>
        <p style="color: #0f766e; font-size: 14px; margin-top: 5px;">AI-Powered Comprehensive Health Assessment</p>
        
        <div class="header-info">
            <div class="header-info-item">
                <strong>Patient Name</strong>
                <span>${patientName}</span>
            </div>
            <div class="header-info-item">
                <strong>Report ID</strong>
                <span>${report.report_id}</span>
            </div>
            <div class="header-info-item">
                <strong>Age / Sex</strong>
                <span>${patientAge} years / ${patientSex}</span>
            </div>
            <div class="header-info-item">
                <strong>Report Date</strong>
                <span>${reportDate}</span>
            </div>
        </div>
    </div>

    <!-- CLINICAL ASSESSMENT (SOAP FORMAT) -->
    <div class="section">
        <div class="section-title">📋 Clinical Assessment (SOAP Format)</div>
        
        <div class="soap-section">
            <div class="soap-label">S - SUBJECTIVE</div>
            <p>${medReport.subjective}</p>
        </div>
        
        <div class="soap-section">
            <div class="soap-label">O - OBJECTIVE</div>
            <div class="subsection">
                <div class="subsection-title">Vital Signs:</div>
                <p>${medReport.objective.vital_signs}</p>
            </div>
            <div class="subsection">
                <div class="subsection-title">Laboratory Findings:</div>
                <p>${medReport.objective.laboratory_findings}</p>
            </div>
            <div class="subsection">
                <div class="subsection-title">Clinical Observations:</div>
                <p>${medReport.objective.clinical_observations}</p>
            </div>
        </div>
        
        <div class="soap-section">
            <div class="soap-label">A - ASSESSMENT</div>
            <div class="subsection">
                <div class="subsection-title">Primary Diagnostic Impression:</div>
                <p>${medReport.assessment.primary_diagnosis}</p>
            </div>
            <div class="subsection">
                <div class="subsection-title">Differential Diagnoses:</div>
                <ul class="recommendation-list">
                    ${medReport.assessment.differential_diagnosis.map(dx => `<li>${dx}</li>`).join('')}
                </ul>
            </div>
            <div class="subsection">
                <div class="subsection-title">Risk Stratification:</div>
                <p><strong>${medReport.assessment.risk_stratification}</strong></p>
            </div>
            <div class="subsection">
                <div class="subsection-title">Prognostic Indicators:</div>
                <p>${medReport.assessment.prognostic_indicators}</p>
            </div>
        </div>
        
        <div class="soap-section">
            <div class="soap-label">P - PLAN</div>
            ${medReport.plan.immediate_interventions?.length > 0 ? `
            <div class="subsection">
                <div class="subsection-title">Immediate Interventions:</div>
                <ul class="recommendation-list">
                    ${medReport.plan.immediate_interventions.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
            ${medReport.plan.pharmacological?.length > 0 ? `
            <div class="subsection">
                <div class="subsection-title">Pharmacological Management:</div>
                <ul class="recommendation-list">
                    ${medReport.plan.pharmacological.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
            ${medReport.plan.non_pharmacological?.length > 0 ? `
            <div class="subsection">
                <div class="subsection-title">Non-Pharmacological Interventions:</div>
                <ul class="recommendation-list">
                    ${medReport.plan.non_pharmacological.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
            ${medReport.plan.monitoring?.length > 0 ? `
            <div class="subsection">
                <div class="subsection-title">Monitoring & Follow-up:</div>
                <ul class="recommendation-list">
                    ${medReport.plan.monitoring.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
            ${medReport.plan.referrals?.length > 0 ? `
            <div class="subsection">
                <div class="subsection-title">Specialist Referrals:</div>
                <ul class="recommendation-list">
                    ${medReport.plan.referrals.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
        </div>
    </div>

    <div class="page-break"></div>

    <!-- PATIENT-FRIENDLY EXPLANATION -->
    <div class="patient-friendly">
        <h3>📖 Understanding Your Results - Patient Guide</h3>
        
        <div style="margin: 20px 0;">
            <h4 style="color: #1e40af; font-size: 16px; margin-bottom: 10px;">Overview:</h4>
            <p>${patientExp.overview}</p>
        </div>
        
        <div style="margin: 20px 0;">
            <h4 style="color: #1e40af; font-size: 16px; margin-bottom: 10px;">What This Means for You:</h4>
            <p>${patientExp.what_this_means}</p>
        </div>
        
        <div style="margin: 20px 0;">
            <h4 style="color: #1e40af; font-size: 16px; margin-bottom: 10px;">Your Action Steps:</h4>
            <p>${patientExp.action_steps}</p>
        </div>
    </div>

    <!-- WARNING SIGNS -->
    <div class="warning-box">
        <h4>⚠️ When to Seek Immediate Medical Attention:</h4>
        <p>${patientExp.when_to_worry}</p>
    </div>

    <!-- POSITIVE ASPECTS -->
    <div class="positive-box">
        <h4>✅ Positive Health Indicators:</h4>
        <p>${patientExp.positive_aspects}</p>
    </div>

    <!-- DISCLAIMER -->
    <div class="disclaimer">
        <strong>⚕️ IMPORTANT MEDICAL DISCLAIMER</strong>
        <p>This report is generated by MediSense AI and is intended for informational purposes only. It does not constitute medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical decisions. This AI-powered analysis should be reviewed and interpreted by your healthcare provider in the context of your complete medical history.</p>
    </div>

    <div class="footer">
        <p><strong>Generated by MediSense AI</strong></p>
        <p>Advanced AI-Powered Medical Analysis System</p>
        <p>Report ID: ${report.report_id} | Generated: ${new Date(report.timestamp).toLocaleString()}</p>
        <p style="margin-top: 10px; font-size: 11px;">This document contains confidential medical information. Handle according to HIPAA guidelines.</p>
    </div>
</body>
</html>
    `;
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border border-gray-200">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <FileText className="h-6 w-6 text-teal-600 flex-shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900">Professional Medical Report</h3>
              <p className="text-sm text-gray-600">AI-powered SOAP format with patient explanations</p>
            </div>
          </div>
          <button
            onClick={generateProfessionalReport}
            disabled={isGenerating}
            className="btn-primary flex items-center justify-center gap-2 px-4 py-3 w-full md:w-auto md:self-start"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Download className="h-5 w-5 flex-shrink-0" />
                <span>Generate & Download Report</span>
              </>
            )}
          </button>
        </div>

        {medicalReport && (
          <div className="bg-teal-50 rounded-lg p-4 md:p-6 space-y-4 border border-teal-200 mt-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-teal-600 flex-shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900">Report Generated Successfully!</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Your comprehensive medical report has been created in professional SOAP format.
                  The report includes doctor-style clinical assessment and patient-friendly explanations.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowPatientExplanation(!showPatientExplanation)}
              className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center space-x-2 transition-colors"
            >
              <Info className="h-4 w-4 flex-shrink-0" />
              <span>{showPatientExplanation ? 'Hide' : 'Show'} Patient-Friendly Summary</span>
            </button>

            {showPatientExplanation && medicalReport.patient_explanation && (
              <div className="bg-white rounded-lg p-4 space-y-3 border border-teal-200">
                <h5 className="font-semibold text-gray-900">Understanding Your Results:</h5>
                <p className="text-sm text-gray-700 break-words">{medicalReport.patient_explanation.overview}</p>
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-900 mb-1">What This Means:</p>
                  <p className="text-sm text-gray-700 break-words">{medicalReport.patient_explanation.what_this_means}</p>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-900 mb-1">Your Next Steps:</p>
                  <p className="text-sm text-gray-700 break-words">{medicalReport.patient_explanation.action_steps}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalReportPDF;
