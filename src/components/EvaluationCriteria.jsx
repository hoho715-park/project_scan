import { X, Palette, Layout, FileCode, Code, Info, Target, Scale } from 'lucide-react';

export default function EvaluationCriteria({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <Info size={24} />
            평가 기준 및 방법
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <section className="criteria-section">
            <div className="section-header">
              <Target size={20} />
              <h3>평가 목적</h3>
            </div>
            <p>
              Project Scan은 주어진 기준 UI 디자인과 제출된 프로젝트 코드 간의
              구현 완성도를 평가합니다. 평가는 100점 만점으로 진행되며,
              4가지 주요 카테고리에 각각 25점씩 배점됩니다.
            </p>
          </section>

          <section className="criteria-section">
            <div className="section-header">
              <Scale size={20} />
              <h3>평가 카테고리</h3>
            </div>

            <div className="criteria-cards">
              <div className="criteria-card color">
                <div className="card-icon">
                  <Palette size={24} />
                </div>
                <h4>색상 스타일링 (25점)</h4>
                <p>CSS 및 스타일 파일에서 정의된 색상의 다양성과 풍부함을 평가합니다.</p>
                <ul>
                  <li><strong>25점:</strong> 5개 이상의 색상 정의 (충분한 스타일링)</li>
                  <li><strong>20점:</strong> 3~4개의 색상 정의 (기본적인 스타일링)</li>
                  <li><strong>15점:</strong> 1~2개의 색상 정의 (최소한의 스타일링)</li>
                  <li><strong>5점:</strong> 색상 정의 없음</li>
                </ul>
                <div className="evaluation-method">
                  <strong>평가 방법:</strong> HEX, RGB, RGBA, HSL, HSLA 색상 코드를
                  CSS, SCSS, JS/JSX 파일에서 추출하여 분석
                </div>
              </div>

              <div className="criteria-card layout">
                <div className="card-icon">
                  <Layout size={24} />
                </div>
                <h4>레이아웃 패턴 (25점)</h4>
                <p>현대적인 CSS 레이아웃 기법의 활용도를 평가합니다.</p>
                <ul>
                  <li><strong>25점:</strong> Flexbox/Grid 사용 + 10개 이상의 레이아웃 패턴</li>
                  <li><strong>20점:</strong> 5개 이상의 레이아웃 패턴</li>
                  <li><strong>15점:</strong> 1~4개의 레이아웃 패턴</li>
                  <li><strong>5점:</strong> 레이아웃 패턴 없음</li>
                </ul>
                <div className="evaluation-method">
                  <strong>평가 방법:</strong> display: flex, display: grid, float,
                  position, margin, padding 등의 사용 빈도 분석
                </div>
              </div>

              <div className="criteria-card structure">
                <div className="card-icon">
                  <FileCode size={24} />
                </div>
                <h4>HTML 구조 (25점)</h4>
                <p>HTML/JSX 마크업의 구조적 복잡성과 시맨틱 태그 사용을 평가합니다.</p>
                <ul>
                  <li><strong>25점:</strong> 10종 이상의 태그 + 10개 이상의 클래스</li>
                  <li><strong>20점:</strong> 5종 이상의 태그 + 5개 이상의 클래스</li>
                  <li><strong>15점:</strong> 1~4종의 태그</li>
                  <li><strong>5점:</strong> HTML 구조 없음</li>
                </ul>
                <div className="evaluation-method">
                  <strong>평가 방법:</strong> HTML, JSX, Vue, Svelte 파일에서
                  사용된 태그 종류와 클래스 이름의 다양성 분석
                </div>
              </div>

              <div className="criteria-card component">
                <div className="card-icon">
                  <Code size={24} />
                </div>
                <h4>컴포넌트 구성 (25점)</h4>
                <p>JavaScript/TypeScript 컴포넌트의 구조적 완성도를 평가합니다.</p>
                <ul>
                  <li><strong>25점:</strong> 잘 구성된 컴포넌트 (점수 20+)</li>
                  <li><strong>20점:</strong> 적절한 컴포넌트 구조 (점수 10-19)</li>
                  <li><strong>15점:</strong> 기본적인 컴포넌트 구조 (점수 1-9)</li>
                  <li><strong>5점:</strong> 컴포넌트 구조 없음</li>
                </ul>
                <div className="evaluation-method">
                  <strong>평가 방법:</strong> import 문(x2), React Hooks(x3),
                  함수 정의(x1)의 가중 합산으로 점수 계산
                </div>
              </div>
            </div>
          </section>

          <section className="criteria-section">
            <div className="section-header">
              <Info size={20} />
              <h3>지원 파일 형식</h3>
            </div>
            <div className="file-types">
              <span className="file-badge">HTML</span>
              <span className="file-badge">CSS</span>
              <span className="file-badge">SCSS</span>
              <span className="file-badge">SASS</span>
              <span className="file-badge">LESS</span>
              <span className="file-badge">JavaScript</span>
              <span className="file-badge">JSX</span>
              <span className="file-badge">TypeScript</span>
              <span className="file-badge">TSX</span>
              <span className="file-badge">Vue</span>
              <span className="file-badge">Svelte</span>
            </div>
          </section>

          <section className="criteria-section note">
            <h3>참고사항</h3>
            <ul>
              <li>분석은 ZIP 파일 내의 소스 코드를 기반으로 진행됩니다.</li>
              <li>node_modules 등의 의존성 폴더는 분석에서 제외하는 것이 좋습니다.</li>
              <li>점수는 상대 평가가 아닌 절대 평가 기준으로 산출됩니다.</li>
              <li>동일한 점수의 프로젝트는 업로드 순서대로 순위가 매겨집니다.</li>
            </ul>
          </section>
        </div>

        <style>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 20px;
            backdrop-filter: blur(4px);
          }

          .modal-content {
            background: white;
            border-radius: 20px;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          }

          .modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 24px 32px;
            border-bottom: 1px solid #eee;
            position: sticky;
            top: 0;
            background: white;
            border-radius: 20px 20px 0 0;
          }

          .modal-header h2 {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 1.5rem;
            color: #1a1a2e;
            margin: 0;
          }

          .close-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 8px;
            color: #666;
            transition: color 0.2s ease;
          }

          .close-btn:hover {
            color: #333;
          }

          .modal-body {
            padding: 24px 32px 32px;
          }

          .criteria-section {
            margin-bottom: 32px;
          }

          .criteria-section:last-child {
            margin-bottom: 0;
          }

          .section-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
            color: #667eea;
          }

          .section-header h3 {
            margin: 0;
            font-size: 1.2rem;
            color: #1a1a2e;
          }

          .criteria-section > p {
            color: #555;
            line-height: 1.7;
          }

          .criteria-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
          }

          .criteria-card {
            padding: 20px;
            border-radius: 12px;
            border: 2px solid;
          }

          .criteria-card.color {
            background: #fce4ec;
            border-color: #e91e63;
          }

          .criteria-card.layout {
            background: #e3f2fd;
            border-color: #2196f3;
          }

          .criteria-card.structure {
            background: #e8f5e9;
            border-color: #4caf50;
          }

          .criteria-card.component {
            background: #fff3e0;
            border-color: #ff9800;
          }

          .card-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 12px;
            color: white;
          }

          .color .card-icon {
            background: #e91e63;
          }

          .layout .card-icon {
            background: #2196f3;
          }

          .structure .card-icon {
            background: #4caf50;
          }

          .component .card-icon {
            background: #ff9800;
          }

          .criteria-card h4 {
            margin: 0 0 8px;
            font-size: 1.1rem;
            color: #333;
          }

          .criteria-card > p {
            font-size: 0.9rem;
            color: #555;
            margin-bottom: 12px;
          }

          .criteria-card ul {
            margin: 0 0 12px;
            padding-left: 20px;
          }

          .criteria-card li {
            font-size: 0.85rem;
            color: #444;
            margin-bottom: 4px;
          }

          .evaluation-method {
            font-size: 0.8rem;
            color: #666;
            background: rgba(255, 255, 255, 0.7);
            padding: 8px 12px;
            border-radius: 6px;
          }

          .file-types {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }

          .file-badge {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
          }

          .criteria-section.note {
            background: #f5f5f5;
            padding: 20px;
            border-radius: 12px;
          }

          .criteria-section.note h3 {
            margin: 0 0 12px;
            color: #666;
            font-size: 1rem;
          }

          .criteria-section.note ul {
            margin: 0;
            padding-left: 20px;
          }

          .criteria-section.note li {
            color: #555;
            font-size: 0.9rem;
            margin-bottom: 6px;
          }
        `}</style>
      </div>
    </div>
  );
}
