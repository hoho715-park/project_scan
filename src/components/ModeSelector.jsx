import { Code, Image, ArrowRight } from 'lucide-react';

export default function ModeSelector({ onSelectMode }) {
  return (
    <div className="mode-selector">
      <h2>비교 방식을 선택하세요</h2>
      <p className="mode-description">
        프로젝트를 어떤 방식으로 비교할지 선택해주세요
      </p>

      <div className="mode-cards">
        <div className="mode-card" onClick={() => onSelectMode('code')}>
          <div className="mode-icon code">
            <Code size={48} />
          </div>
          <h3>코드로 비교하기</h3>
          <p>
            ZIP 파일로 압축된 프로젝트 코드를 분석하여
            CSS 스타일링, 레이아웃, HTML 구조, 컴포넌트 구성을 평가합니다.
          </p>
          <ul className="mode-features">
            <li>색상 스타일링 분석</li>
            <li>레이아웃 패턴 분석</li>
            <li>HTML 구조 분석</li>
            <li>컴포넌트 구성 분석</li>
          </ul>
          <button className="mode-btn">
            코드 비교 시작
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="mode-card" onClick={() => onSelectMode('image')}>
          <div className="mode-icon image">
            <Image size={48} />
          </div>
          <h3>이미지로 비교하기</h3>
          <p>
            기준 UI 이미지와 각 프로젝트의 결과 스크린샷을
            직접 비교하여 시각적 유사도를 측정합니다.
          </p>
          <ul className="mode-features">
            <li>픽셀 단위 색상 비교</li>
            <li>구조적 유사도 분석</li>
            <li>색상 히스토그램 비교</li>
            <li>엣지 검출 비교</li>
          </ul>
          <button className="mode-btn">
            이미지 비교 시작
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <style>{`
        .mode-selector {
          text-align: center;
          padding: 20px;
        }

        .mode-selector h2 {
          font-size: 2rem;
          color: var(--gray-800, #1e293b);
          margin-bottom: 12px;
        }

        .mode-description {
          color: var(--gray-500, #64748b);
          font-size: 1.1rem;
          margin-bottom: 40px;
        }

        .mode-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
          max-width: 800px;
          margin: 0 auto;
        }

        .mode-card {
          background: white;
          border-radius: 20px;
          padding: 32px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 3px solid transparent;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        }

        .mode-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
        }

        .mode-card:first-child:hover {
          border-color: var(--primary, #10b981);
        }

        .mode-card:last-child:hover {
          border-color: var(--secondary, #6366f1);
        }

        .mode-icon {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: white;
        }

        .mode-icon.code {
          background: linear-gradient(135deg, var(--primary, #10b981), var(--primary-dark, #059669));
        }

        .mode-icon.image {
          background: linear-gradient(135deg, var(--secondary, #6366f1), var(--secondary-dark, #4f46e5));
        }

        .mode-card h3 {
          font-size: 1.4rem;
          color: var(--gray-800, #1e293b);
          margin-bottom: 12px;
        }

        .mode-card > p {
          color: var(--gray-500, #64748b);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .mode-features {
          list-style: none;
          padding: 0;
          margin: 0 0 24px;
          text-align: left;
        }

        .mode-features li {
          padding: 8px 0;
          color: var(--gray-600, #475569);
          font-size: 0.9rem;
          border-bottom: 1px solid var(--gray-100, #f1f5f9);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mode-features li::before {
          content: "✓";
          color: var(--primary, #10b981);
          font-weight: bold;
        }

        .mode-card:last-child .mode-features li::before {
          color: var(--secondary, #6366f1);
        }

        .mode-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 24px;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .mode-card:first-child .mode-btn {
          background: linear-gradient(135deg, var(--primary, #10b981), var(--primary-dark, #059669));
          color: white;
        }

        .mode-card:last-child .mode-btn {
          background: linear-gradient(135deg, var(--secondary, #6366f1), var(--secondary-dark, #4f46e5));
          color: white;
        }

        .mode-btn:hover {
          transform: scale(1.02);
        }

        @media (max-width: 700px) {
          .mode-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
