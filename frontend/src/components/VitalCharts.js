import React from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MedicalIcons } from './MedicalIcons';

const VitalCharts = ({ analysis }) => {
  // Mock data for demonstration - in real app, this would come from longitudinal data
  const bpData = [
    { date: '2024-01', systolic: 140, diastolic: 90, normal_systolic: 120, normal_diastolic: 80 },
    { date: '2024-02', systolic: 135, diastolic: 88, normal_systolic: 120, normal_diastolic: 80 },
    { date: '2024-03', systolic: 132, diastolic: 85, normal_systolic: 120, normal_diastolic: 80 },
    { date: '2024-04', systolic: 128, diastolic: 82, normal_systolic: 120, normal_diastolic: 80 },
    { date: '2024-05', systolic: 125, diastolic: 80, normal_systolic: 120, normal_diastolic: 80 },
    { date: 'Current', systolic: 138, diastolic: 88, normal_systolic: 120, normal_diastolic: 80 }
  ];

  const cholesterolData = [
    { date: '2024-01', total: 240, hdl: 35, ldl: 180, optimal_total: 200, optimal_hdl: 60, optimal_ldl: 100 },
    { date: '2024-02', total: 235, hdl: 38, ldl: 175, optimal_total: 200, optimal_hdl: 60, optimal_ldl: 100 },
    { date: '2024-03', total: 228, hdl: 42, ldl: 168, optimal_total: 200, optimal_hdl: 60, optimal_ldl: 100 },
    { date: 'Current', total: 220, hdl: 45, ldl: 155, optimal_total: 200, optimal_hdl: 60, optimal_ldl: 100 }
  ];

  const sugarData = [
    { date: '2024-01', fasting: 126, postMeal: 180, hba1c: 7.5, normal_fasting: 100, normal_postMeal: 140, normal_hba1c: 5.7 },
    { date: '2024-02', fasting: 122, postMeal: 175, hba1c: 7.2, normal_fasting: 100, normal_postMeal: 140, normal_hba1c: 5.7 },
    { date: '2024-03', fasting: 118, postMeal: 165, hba1c: 6.9, normal_fasting: 100, normal_postMeal: 140, normal_hba1c: 5.7 },
    { date: 'Current', fasting: 115, postMeal: 160, hba1c: 6.8, normal_fasting: 100, normal_postMeal: 140, normal_hba1c: 5.7 }
  ];

  const bmiData = [
    { date: '2024-01', bmi: 28.5, category: 'Overweight', normal_bmi: 22 },
    { date: '2024-02', bmi: 27.8, category: 'Overweight', normal_bmi: 22 },
    { date: '2024-03', bmi: 27.2, category: 'Overweight', normal_bmi: 22 },
    { date: 'Current', bmi: 26.8, category: 'Overweight', normal_bmi: 22 }
  ];

  // Health metrics pie chart data
  const healthMetrics = [
    { name: 'Normal', value: 35, color: '#10b981' },
    { name: 'Borderline', value: 40, color: '#f59e0b' },
    { name: 'High Risk', value: 25, color: '#ef4444' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{margin: 0, fontWeight: 'bold', color: '#374151'}}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{margin: '4px 0', color: entry.color}}>
              {entry.name}: {entry.value}
              {entry.name.includes('systolic') || entry.name.includes('diastolic') ? ' mmHg' : ''}
              {entry.name.includes('sugar') || entry.name.includes('fasting') ? ' mg/dL' : ''}
              {entry.name.includes('cholesterol') ? ' mg/dL' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

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
        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          <MedicalIcons.HeartRate />
          <div>
            <h1 style={{fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0}}>
              Vital Signs & Trends
            </h1>
            <p style={{color: '#6b7280', fontSize: '1rem', margin: '4px 0 0 0'}}>
              Interactive charts showing your health progress over time
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px'}}>
        
        {/* Blood Pressure Chart */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px'}}>
            <MedicalIcons.HeartIcon />
            <h3 style={{fontSize: '1.3rem', fontWeight: '600', color: '#1f2937', margin: 0}}>
              Blood Pressure Trend
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={bpData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="systolic" 
                stroke="#ef4444" 
                strokeWidth={3}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 6 }}
                name="Systolic"
              />
              <Line 
                type="monotone" 
                dataKey="diastolic" 
                stroke="#f59e0b" 
                strokeWidth={3}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 6 }}
                name="Diastolic"
              />
              <Line 
                type="monotone" 
                dataKey="normal_systolic" 
                stroke="#10b981" 
                strokeDasharray="5 5"
                strokeWidth={2}
                name="Normal Systolic"
              />
              <Line 
                type="monotone" 
                dataKey="normal_diastolic" 
                stroke="#059669" 
                strokeDasharray="5 5"
                strokeWidth={2}
                name="Normal Diastolic"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Cholesterol Chart */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px'}}>
            <MedicalIcons.Analysis />
            <h3 style={{fontSize: '1.3rem', fontWeight: '600', color: '#1f2937', margin: 0}}>
              Cholesterol Levels
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={cholesterolData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="total" 
                stackId="1"
                stroke="#8b5cf6" 
                fill="#8b5cf6"
                fillOpacity={0.3}
                name="Total Cholesterol"
              />
              <Area 
                type="monotone" 
                dataKey="ldl" 
                stackId="2"
                stroke="#ef4444" 
                fill="#ef4444"
                fillOpacity={0.3}
                name="LDL (Bad)"
              />
              <Area 
                type="monotone" 
                dataKey="hdl" 
                stackId="3"
                stroke="#10b981" 
                fill="#10b981"
                fillOpacity={0.3}
                name="HDL (Good)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Blood Sugar Chart */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px'}}>
            <MedicalIcons.DiabetesIcon />
            <h3 style={{fontSize: '1.3rem', fontWeight: '600', color: '#1f2937', margin: 0}}>
              Blood Sugar Levels
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={sugarData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="fasting" fill="#f59e0b" name="Fasting Glucose" />
              <Bar dataKey="postMeal" fill="#ef4444" name="Post Meal Glucose" />
              <Line 
                type="monotone" 
                dataKey="normal_fasting" 
                stroke="#10b981" 
                strokeDasharray="5 5"
                strokeWidth={2}
                name="Normal Fasting"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* BMI Trend & Health Overview */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px'}}>
            <MedicalIcons.Analysis />
            <h3 style={{fontSize: '1.3rem', fontWeight: '600', color: '#1f2937', margin: 0}}>
              BMI & Health Overview
            </h3>
          </div>
          <div style={{display: 'flex', height: 250}}>
            <div style={{flex: 1}}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bmiData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="bmi" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                    name="BMI"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="normal_bmi" 
                    stroke="#10b981" 
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    name="Normal BMI"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{width: '120px', paddingLeft: '16px'}}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={healthMetrics}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {healthMetrics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div style={{fontSize: '0.8rem', marginTop: '8px'}}>
                {healthMetrics.map((metric, index) => (
                  <div key={index} style={{display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px'}}>
                    <div style={{
                      width: '8px', 
                      height: '8px', 
                      backgroundColor: metric.color, 
                      borderRadius: '50%'
                    }} />
                    <span style={{color: '#6b7280'}}>{metric.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Health Insights */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <h3 style={{fontSize: '1.3rem', fontWeight: '600', color: '#1f2937', marginBottom: '16px'}}>
          Health Insights & Trends
        </h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px'}}>
          <div style={{
            padding: '16px',
            background: 'linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%)',
            borderRadius: '12px',
            border: '1px solid #bbf7d0'
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
              <MedicalIcons.CheckIcon />
              <span style={{fontSize: '0.9rem', fontWeight: '600', color: '#166534'}}>Blood Pressure</span>
            </div>
            <p style={{fontSize: '0.8rem', color: '#374151', margin: 0}}>
              Improving trend over 6 months. Down 15/10 mmHg from peak.
            </p>
          </div>
          
          <div style={{
            padding: '16px',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)',
            borderRadius: '12px',
            border: '1px solid #fed7aa'
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
              <MedicalIcons.RiskIcon />
              <span style={{fontSize: '0.9rem', fontWeight: '600', color: '#92400e'}}>Cholesterol</span>
            </div>
            <p style={{fontSize: '0.8rem', color: '#374151', margin: 0}}>
              Total cholesterol reduced by 20 mg/dL. HDL improved significantly.
            </p>
          </div>
          
          <div style={{
            padding: '16px',
            background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)',
            borderRadius: '12px',
            border: '1px solid #bae6fd'
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
              <MedicalIcons.DiabetesIcon />
              <span style={{fontSize: '0.9rem', fontWeight: '600', color: '#0369a1'}}>Blood Sugar</span>
            </div>
            <p style={{fontSize: '0.8rem', color: '#374151', margin: 0}}>
              HbA1c improved from 7.5% to 6.8%. Good glucose control.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VitalCharts;