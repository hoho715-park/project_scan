import { Scan, FileSearch, BarChart3, CheckCircle, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

const LOADING_STEPS = [
  { icon: FileSearch, text: 'ZIP 파일 분석 중...', completeText: 'ZIP 파일 분석 완료' },
  { icon: Scan, text: '코드 구조 스캔 중...', completeText: '코드 구조 스캔 완료' },
  { icon: BarChart3, text: '유사도 계산 중...', completeText: '유사도 계산 완료' },
  { icon: CheckCircle, text: '결과 생성 중...', completeText: '결과 생성 완료' },
];

export default function LoadingScreen({ projectCount, mode = 'code' }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  // 모드에 따른 스텝 텍스트
  const getSteps = () => {
    if (mode === 'image') {
      return [
        { icon: FileSearch, text: '이미지 로딩 중...', completeText: '이미지 로딩 완료' },
        { icon: Scan, text: '픽셀 분석 중...', completeText: '픽셀 분석 완료' },
        { icon: BarChart3, text: '유사도 계산 중...', completeText: '유사도 계산 완료' },
        { icon: CheckCircle, text: '결과 생성 중...', completeText: '결과 생성 완료' },
      ];
    } else if (mode === 'quality') {
      return [
        { icon: FileSearch, text: 'ZIP 파일 분석 중...', completeText: 'ZIP 파일 분석 완료' },
        { icon: Scan, text: '코드 파싱 중...', completeText: '코드 파싱 완료' },
        { icon: BarChart3, text: '품질 지표 계산 중...', completeText: '품질 지표 계산 완료' },
        { icon: CheckCircle, text: '결과 생성 중...', completeText: '결과 생성 완료' },
      ];
    }
    return LOADING_STEPS;
  };

  const steps = getSteps();

  useEffect(() => {
    // 각 단계별 시간
    const stepDuration = mode === 'image' ? 900 : mode === 'quality' ? 700 : 1300;
    const totalSteps = steps.length;

    let stepIndex = 0;

    // 첫 번째 단계 시작
    setCurrentStep(0);
    setProgress(5);

    const stepInterval = setInterval(() => {
      stepIndex++;

      if (stepIndex < totalSteps) {
        // 이전 단계 완료 처리
        setCompletedSteps(prev => [...prev, stepIndex - 1]);
        // 다음 단계로 이동
        setCurrentStep(stepIndex);
        // 진행률 업데이트
        setProgress(Math.round((stepIndex / totalSteps) * 85) + 10);
      } else if (stepIndex === totalSteps) {
        // 마지막 단계 완료
        setCompletedSteps(prev => [...prev, stepIndex - 1]);
        setProgress(95);
      }
    }, stepDuration);

    // 부드러운 진행률 업데이트
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const target = Math.round((currentStep / totalSteps) * 85) + 10;
        if (prev < target) {
          return Math.min(prev + 1, target);
        }
        return prev;
      });
    }, 100);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [mode]);

  const CurrentIcon = steps[currentStep]?.icon || Scan;

  return (
    <div className="loading-overlay">
      <div className="loading-card">
        <div className="loading-icon-container">
          <div className="loading-ring"></div>
          <CurrentIcon size={48} className="loading-icon" />
        </div>

        <h2>프로젝트 분석 중</h2>
        <p className="loading-subtitle">{projectCount}개의 프로젝트를 분석하고 있습니다</p>

        <div className="loading-steps">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep && !completedSteps.includes(index);
            const isComplete = completedSteps.includes(index);

            return (
              <div
                key={index}
                className={`loading-step ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`}
              >
                <div className="step-icon">
                  {isComplete ? <Check size={18} /> : <StepIcon size={18} />}
                </div>
                <span>{isComplete ? step.completeText : step.text}</span>
                {isComplete && <Check size={16} className="check-mark" />}
              </div>
            );
          })}
        </div>

        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="progress-text">{Math.round(progress)}%</span>
        </div>
      </div>

      <style>{`
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .loading-card {
          background: white;
          border-radius: 24px;
          padding: 48px;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
          max-width: 480px;
          width: 90%;
          border: 1px solid var(--gray-200, #e2e8f0);
        }

        .loading-icon-container {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loading-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 4px solid var(--gray-200, #e2e8f0);
          border-top-color: var(--secondary, #6366f1);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-icon {
          color: var(--secondary, #6366f1);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }

        .loading-card h2 {
          font-size: 1.5rem;
          color: var(--gray-800, #1e293b);
          margin-bottom: 8px;
        }

        .loading-subtitle {
          color: var(--gray-500, #64748b);
          margin-bottom: 32px;
        }

        .loading-steps {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 32px;
        }

        .loading-step {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          background: var(--gray-100, #f1f5f9);
          color: var(--gray-400, #94a3b8);
          transition: all 0.4s ease;
        }

        .loading-step.active {
          background: linear-gradient(135deg, var(--secondary-bg, #eef2ff), #e0e7ff);
          color: var(--secondary-dark, #4f46e5);
          font-weight: 500;
          animation: stepPulse 1.5s ease-in-out infinite;
        }

        @keyframes stepPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.3); }
          50% { box-shadow: 0 0 0 8px rgba(99, 102, 241, 0); }
        }

        .loading-step.complete {
          background: var(--primary-bg, #ecfdf5);
          color: var(--primary-dark, #059669);
          border: 1px solid var(--primary-lighter, #6ee7b7);
        }

        .step-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .loading-step.active .step-icon {
          background: var(--secondary, #6366f1);
          color: white;
        }

        .loading-step.complete .step-icon {
          background: var(--primary, #10b981);
          color: white;
        }

        .loading-step span {
          flex: 1;
          text-align: left;
        }

        .check-mark {
          color: var(--primary, #10b981);
          animation: checkAppear 0.3s ease-out;
        }

        @keyframes checkAppear {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .progress-container {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .progress-bar {
          flex: 1;
          height: 8px;
          background: var(--gray-200, #e2e8f0);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--secondary-light, #818cf8), var(--secondary, #6366f1));
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--secondary, #6366f1);
          min-width: 45px;
        }
      `}</style>
    </div>
  );
}
