import React from 'react';

// Professional Medical Icons Component
export const MedicalIcons = {
  // Main brand icon with enhanced styling
  Brain: () => (
    <div style={{
      width: '48px',
      height: '48px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '24px',
      fontWeight: 'bold',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '-2px',
        right: '-2px',
        width: '8px',
        height: '8px',
        background: '#00f2fe',
        borderRadius: '50%',
        boxShadow: '0 0 6px rgba(0, 242, 254, 0.6)'
      }} />
      AI
    </div>
  ),

  // Analysis and findings icons
  Analysis: () => (
    <div style={{
      width: '32px',
      height: '32px',
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '16px',
      fontWeight: 'bold'
    }}>
      📊
    </div>
  ),

  Stethoscope: () => (
    <div style={{
      width: '32px',
      height: '32px',
      background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '18px'
    }}>
      🩺
    </div>
  ),

  HeartRate: () => (
    <div style={{
      width: '32px',
      height: '32px',
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ffa8a8 100%)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '16px'
    }}>
      💗
    </div>
  ),

  MedicalSearch: () => (
    <div style={{
      width: '28px',
      height: '28px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '14px'
    }}>
      🔬
    </div>
  ),

  // Condition-specific icons
  DiabetesIcon: () => (
    <div style={{
      width: '36px',
      height: '36px',
      background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#8b5cf6',
      fontSize: '18px',
      fontWeight: 'bold'
    }}>
      🩸
    </div>
  ),

  HeartIcon: () => (
    <div style={{
      width: '36px',
      height: '36px',
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '18px'
    }}>
      ❤️
    </div>
  ),

  KidneyIcon: () => (
    <div style={{
      width: '36px',
      height: '36px',
      background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '18px'
    }}>
      🫘
    </div>
  ),

  // Action icons
  RecommendationIcon: () => (
    <div style={{
      width: '24px',
      height: '24px',
      background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '12px'
    }}>
      💡
    </div>
  ),

  LifestyleIcon: () => (
    <div style={{
      width: '24px',
      height: '24px',
      background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#059669',
      fontSize: '12px'
    }}>
      🌱
    </div>
  ),

  MonitoringIcon: () => (
    <div style={{
      width: '24px',
      height: '24px',
      background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#7c3aed',
      fontSize: '12px'
    }}>
      📊
    </div>
  ),

  RiskIcon: () => (
    <div style={{
      width: '32px',
      height: '32px',
      background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#dc2626',
      fontSize: '16px',
      fontWeight: 'bold'
    }}>
      ⚠️
    </div>
  ),

  // Document icons
  DocumentIcon: () => (
    <div style={{
      width: '64px',
      height: '64px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '28px',
      boxShadow: '0 8px 24px rgba(102, 126, 234, 0.2)'
    }}>
      📄
    </div>
  ),

  UploadIcon: () => (
    <div style={{
      width: '24px',
      height: '24px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '12px'
    }}>
      ⬆️
    </div>
  ),

  DemoIcon: () => (
    <div style={{
      width: '24px',
      height: '24px',
      background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '12px'
    }}>
      ⚡
    </div>
  ),

  // Status icons
  SuccessIcon: () => (
    <div style={{
      width: '32px',
      height: '32px',
      background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '16px'
    }}>
      ✅
    </div>
  ),

  LoadingIcon: () => (
    <div style={{
      width: '32px',
      height: '32px',
      background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#f59e0b',
      fontSize: '16px',
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
    }}>
      ⏳
    </div>
  ),

  ErrorIcon: () => (
    <div style={{
      width: '32px',
      height: '32px',
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ffa8a8 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '16px'
    }}>
      ⚠️
    </div>
  ),

  // Number badges for findings
  NumberBadge: ({ number }) => (
    <div style={{
      width: '28px',
      height: '28px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '12px',
      fontWeight: '600',
      border: '2px solid white',
      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
    }}>
      {number}
    </div>
  ),

  CheckIcon: () => (
    <div style={{
      width: '20px',
      height: '20px',
      background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '10px'
    }}>
      ✓
    </div>
  )
};

// Medical gradient backgrounds
export const MedicalGradients = {
  primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  success: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
  warning: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  danger: 'linear-gradient(135deg, #ff6b6b 0%, #ffa8a8 100%)',
  info: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  medical: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  cardio: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
};