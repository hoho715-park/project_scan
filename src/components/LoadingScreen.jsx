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
  const steps = mode === 'image'
    ? [
        { icon: FileSearch, text: '이미지 로딩 중...', completeText: '이미지 로딩 완료' },
        { icon: Scan, text: '픽셀 분석 중...', completeText: '픽셀 분석 완료' },
        { icon: BarChart3, text: '유사도 계산 중...', completeText: '유사도 계산 완료' },
        { icon: CheckCircle, text: '결과 생성 중...', completeText: '결과 생성 완료' },
      ]
    : LOADING_STEPS;

  useEffect(() => {
    // 각 단계별 시간 (총 5.5초로 설정하여 6초 minLoadingTime보다 약간 빠르게)
    const stepDuration = mode === 'image' ? 900 : 1300; // 이미지 모드는 더 빠르게
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
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          max-width: 480px;
          width: 90%;
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
          border: 4px solid #e0f2e9;
          border-top-color: var(--primary-dark, #22c55e);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-icon {
          color: var(--primary-dark, #22c55e);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }

        .loading-card h2 {
          font-size: 1.5rem;
          color: #1a1a2e;
          margin-bottom: 8px;
        }

        .loading-subtitle {
          color: #666;
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
          background: #f5f5f5;
          color: #999;
          transition: all 0.4s ease;
        }

        .loading-step.active {
          background: linear-gradient(135deg, #d1fae5, #a7f3d0);
          color: var(--primary-darker, #16a34a);
          font-weight: 500;
          animation: stepPulse 1.5s ease-in-out infinite;
        }

        @keyframes stepPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.3); }
          50% { box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
        }

        .loading-step.complete {
          background: #f0fdf4;
          color: var(--primary-dark, #22c55e);
          border: 1px solid #bbf7d0;
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
          background: var(--primary-dark, #22c55e);
          color: white;
        }

        .loading-step.complete .step-icon {
          background: var(--primary-dark, #22c55e);
          color: white;
        }

        .loading-step span {
          flex: 1;
          text-align: left;
        }

        .check-mark {
          color: var(--primary-dark, #22c55e);
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
          background: #e0f2e9;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary, #4ade80), var(--primary-dark, #22c55e));
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--primary-dark, #22c55e);
          min-width: 45px;
        }
      `}</style>
    </div>
  );
}
