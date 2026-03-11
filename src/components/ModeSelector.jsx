import { Code, Image, BarChart3, ArrowRight } from 'lucide-react';

export default function ModeSelector({ onSelectMode }) {
  return (
    <div className="mode-selector">
      <h2>비교 방식을 선택하세요</h2>
      <p className="mode-description">
        프로젝트를 어떤 방식으로 비교할지 선택해주세요
      </p>

      <div className="mode-cards">
        <div className="mode-card code-card" onClick={() => onSelectMode('code')}>
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
          <button className="mode-btn code-btn">
            코드 비교 시작
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="mode-card image-card" onClick={() => onSelectMode('image')}>
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
          <button className="mode-btn image-btn">
            이미지 비교 시작
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="mode-card quality-card" onClick={() => onSelectMode('quality')}>
          <div className="mode-icon quality">
            <BarChart3 size={48} />
          </div>
          <h3>코드 품질 비교</h3>
          <p>
            프로젝트 코드를 파싱하여 LOC, 순환 복잡도,
            결합도 등 코드 품질 지표를 비교 분석합니다.
          </p>
          <ul className="mode-features">
            <li>Total LOC (코드 라인 수)</li>
            <li>평균 순환 복잡도 (CC)</li>
            <li>평균 결합도 (CBO)</li>
            <li>함수/클래스 수 분석</li>
          </ul>
          <button className="mode-btn quality-btn">
            품질 분석 시작
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
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .mode-card {
          background: white;
          border-radius: 20px;
          padding: 28px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 3px solid transparent;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        }

        .mode-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
        }

        .code-card:hover {
          border-color: var(--primary, #10b981);
        }

        .image-card:hover {
          border-color: var(--secondary, #6366f1);
        }

        .quality-card:hover {
          border-color: #f59e0b;
        }

        .mode-icon {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: white;
        }

        .mode-icon.code {
          background: linear-gradient(135deg, var(--primary, #10b981), var(--primary-dark, #059669));
        }

        .mode-icon.image {
          background: linear-gradient(135deg, var(--secondary, #6366f1), var(--secondary-dark, #4f46e5));
        }

        .mode-icon.quality {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        .mode-card h3 {
          font-size: 1.3rem;
          color: var(--gray-800, #1e293b);
          margin-bottom: 12px;
        }

        .mode-card > p {
          color: var(--gray-500, #64748b);
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .mode-features {
          list-style: none;
          padding: 0;
          margin: 0 0 20px;
          text-align: left;
        }

        .mode-features li {
          padding: 6px 0;
          color: var(--gray-600, #475569);
          font-size: 0.85rem;
          border-bottom: 1px solid var(--gray-100, #f1f5f9);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mode-features li::before {
          content: "✓";
          font-weight: bold;
        }

        .code-card .mode-features li::before {
          color: var(--primary, #10b981);
        }

        .image-card .mode-features li::before {
          color: var(--secondary, #6366f1);
        }

        .quality-card .mode-features li::before {
          color: #f59e0b;
        }

        .mode-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
          border: none;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          color: white;
        }

        .code-btn {
          background: linear-gradient(135deg, var(--primary, #10b981), var(--primary-dark, #059669));
        }

        .image-btn {
          background: linear-gradient(135deg, var(--secondary, #6366f1), var(--secondary-dark, #4f46e5));
        }

        .quality-btn {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        .mode-btn:hover {
          transform: scale(1.02);
        }

        @media (max-width: 900px) {
          .mode-cards {
            grid-template-columns: 1fr;
            max-width: 400px;
          }
        }
      `}</style>
    </div>
  );
}
