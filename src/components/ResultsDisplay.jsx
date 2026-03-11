import { Trophy, Medal, Star, ChevronDown, ChevronUp, Palette, Layout, Code, FileCode, ImageIcon } from 'lucide-react';
import { useState } from 'react';

const PROJECT_COLORS = [
  { bg: '#dcfce7', border: '#22c55e', text: '#166534', gradient: 'linear-gradient(135deg, #22c55e, #16a34a)' },
  { bg: '#d1fae5', border: '#10b981', text: '#065f46', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
  { bg: '#cffafe', border: '#06b6d4', text: '#155e75', gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
  { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
];

const RANK_ICONS = [
  { icon: Trophy, color: '#ffd700' },
  { icon: Medal, color: '#c0c0c0' },
  { icon: Medal, color: '#cd7f32' },
  { icon: Star, color: '#22c55e' },
];

function ScoreCircle({ score, size = 120, strokeWidth = 8, color }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="score-circle-container" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e0f2e9"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="score-text">
        <span className="score-value">{score}</span>
        <span className="score-unit">점</span>
      </div>
    </div>
  );
}

function BreakdownItem({ icon: Icon, title, score, maxScore, details, color }) {
  const percentage = (score / maxScore) * 100;

  return (
    <div className="breakdown-item">
      <div className="breakdown-header">
        <Icon size={18} style={{ color }} />
        <span className="breakdown-title">{title}</span>
        <span className="breakdown-score">{score}/{maxScore}</span>
      </div>
      <div className="breakdown-bar-container">
        <div
          className="breakdown-bar"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
      <p className="breakdown-details">{details}</p>
    </div>
  );
}

function ProjectResult({ project, index, isExpanded, onToggle, projectData }) {
  const colorScheme = PROJECT_COLORS[index % PROJECT_COLORS.length];
  const RankIcon = RANK_ICONS[project.rank - 1]?.icon || Star;
  const rankColor = RANK_ICONS[project.rank - 1]?.color || '#22c55e';

  if (project.error) {
    return (
      <div className="project-result error">
        <div className="result-header">
          <h4>{project.name}</h4>
          <span className="error-badge">오류 발생</span>
        </div>
        <p className="error-message">{project.error}</p>
      </div>
    );
  }

  return (
    <div
      className="project-result"
      style={{
        borderColor: colorScheme.border,
      }}
    >
      <div className="result-header" onClick={onToggle}>
        <div className="rank-badge" style={{ background: colorScheme.gradient }}>
          <RankIcon size={20} style={{ color: project.rank <= 3 ? rankColor : 'white' }} />
          <span>{project.rank}위</span>
        </div>

        <div className="project-info">
          <h4 style={{ color: colorScheme.text }}>{project.name}</h4>
        </div>

        <ScoreCircle
          score={project.totalScore}
          size={80}
          strokeWidth={6}
          color={colorScheme.border}
        />

        <button className="expand-btn">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {isExpanded && (
        <div className="result-details">
          {/* 프로젝트 결과 이미지 */}
          {projectData?.resultImagePreview && (
            <div className="project-result-image">
              <h5>
                <ImageIcon size={16} />
                프로젝트 결과 스크린샷
              </h5>
              <img
                src={projectData.resultImagePreview}
                alt={`${project.name} 결과`}
                className="result-screenshot"
              />
            </div>
          )}

          <h5>세부 평가 항목</h5>
          <div className="breakdown-list">
            <BreakdownItem
              icon={Palette}
              title="색상 스타일링"
              score={project.breakdown.colorSimilarity.score}
              maxScore={project.breakdown.colorSimilarity.maxScore}
              details={project.breakdown.colorSimilarity.details}
              color="#ec4899"
            />
            <BreakdownItem
              icon={Layout}
              title="레이아웃 패턴"
              score={project.breakdown.layoutSimilarity.score}
              maxScore={project.breakdown.layoutSimilarity.maxScore}
              details={project.breakdown.layoutSimilarity.details}
              color="#06b6d4"
            />
            <BreakdownItem
              icon={FileCode}
              title="HTML 구조"
              score={project.breakdown.structureSimilarity.score}
              maxScore={project.breakdown.structureSimilarity.maxScore}
              details={project.breakdown.structureSimilarity.details}
              color="#22c55e"
            />
            <BreakdownItem
              icon={Code}
              title="컴포넌트 구성"
              score={project.breakdown.componentSimilarity.score}
              maxScore={project.breakdown.componentSimilarity.maxScore}
              details={project.breakdown.componentSimilarity.details}
              color="#f59e0b"
            />
          </div>

          {project.analysis && (
            <div className="analysis-summary">
              <h5>프로젝트 분석 요약</h5>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">파일 수</span>
                  <span className="summary-value">{project.analysis.fileCount}개</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">총 크기</span>
                  <span className="summary-value">{(project.analysis.totalSize / 1024).toFixed(1)}KB</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">색상 정의</span>
                  <span className="summary-value">{project.analysis.colors.length}개</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">HTML 태그 종류</span>
                  <span className="summary-value">{Object.keys(project.analysis.htmlStructure.tags).length}종</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        .project-result {
          background: white;
          border-radius: 16px;
          border: 3px solid;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .project-result:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }

        .project-result.error {
          border-color: #e74c3c;
          padding: 20px;
        }

        .error-badge {
          background: #e74c3c;
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.85rem;
        }

        .error-message {
          color: #e74c3c;
          margin-top: 12px;
        }

        .result-header {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          cursor: pointer;
        }

        .rank-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 20px;
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .project-info {
          flex: 1;
        }

        .project-info h4 {
          font-size: 1.2rem;
          margin: 0;
        }

        .score-circle-container {
          position: relative;
        }

        .score-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .score-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #333;
        }

        .score-unit {
          font-size: 0.7rem;
          color: #888;
          display: block;
        }

        .expand-btn {
          background: #f0fdf4;
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s ease;
          color: #166534;
        }

        .expand-btn:hover {
          background: #dcfce7;
        }

        .result-details {
          padding: 0 20px 20px;
          border-top: 1px solid #e0f2e9;
          background: #f0fdf4;
        }

        .result-details h5 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 16px 0 12px;
          color: #166534;
          font-size: 1rem;
        }

        .project-result-image {
          margin-bottom: 20px;
        }

        .result-screenshot {
          max-width: 100%;
          max-height: 300px;
          border-radius: 12px;
          border: 2px solid #dcfce7;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .breakdown-list {
          display: grid;
          gap: 16px;
        }

        .breakdown-item {
          background: white;
          padding: 12px;
          border-radius: 8px;
        }

        .breakdown-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .breakdown-title {
          flex: 1;
          font-weight: 500;
          color: #333;
        }

        .breakdown-score {
          font-weight: 600;
          color: #666;
        }

        .breakdown-bar-container {
          height: 6px;
          background: #e0f2e9;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 6px;
        }

        .breakdown-bar {
          height: 100%;
          border-radius: 3px;
          transition: width 0.8s ease-out;
        }

        .breakdown-details {
          font-size: 0.85rem;
          color: #666;
          margin: 0;
        }

        .analysis-summary {
          margin-top: 16px;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
        }

        .summary-item {
          background: white;
          padding: 12px;
          border-radius: 8px;
          text-align: center;
        }

        .summary-label {
          display: block;
          font-size: 0.8rem;
          color: #888;
          margin-bottom: 4px;
        }

        .summary-value {
          font-size: 1.1rem;
          font-weight: 600;
          color: #166534;
        }
      `}</style>
    </div>
  );
}

export default function ResultsDisplay({ results, originalProjects }) {
  const [expandedId, setExpandedId] = useState(null);

  if (!results) return null;

  const handleToggle = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // 원본 프로젝트 데이터에서 이미지 찾기
  const getProjectData = (projectName) => {
    return originalProjects?.find(p => p.name === projectName || p.displayName === projectName);
  };

  return (
    <div className="results-display">
      <div className="results-header">
        <h2>분석 결과</h2>
        <p>총 {results.projects.length}개 프로젝트 비교 완료</p>
      </div>

      <div className="reference-info">
        <img
          src={URL.createObjectURL(results.referenceImage.file || results.referenceImage)}
          alt="기준 UI"
          className="reference-thumbnail"
        />
        <div>
          <h4>기준 UI 이미지</h4>
          <p>{results.referenceImage.name}</p>
          <p className="dimensions">
            {results.referenceImage.width} x {results.referenceImage.height}px
          </p>
        </div>
      </div>

      <div className="projects-results">
        {results.projects.map((project, index) => (
          <ProjectResult
            key={project.id}
            project={project}
            index={index}
            isExpanded={expandedId === project.id}
            onToggle={() => handleToggle(project.id)}
            projectData={getProjectData(project.name)}
          />
        ))}
      </div>

      <style>{`
        .results-display {
          background: white;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }

        .results-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .results-header h2 {
          font-size: 1.8rem;
          color: #166534;
          margin-bottom: 8px;
        }

        .results-header p {
          color: #666;
        }

        .reference-info {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: linear-gradient(135deg, #dcfce720, #a7f3d020);
          border: 2px solid #dcfce7;
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .reference-thumbnail {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          border: 2px solid #22c55e;
        }

        .reference-info h4 {
          margin: 0 0 4px;
          color: #166534;
        }

        .reference-info p {
          margin: 0;
          font-size: 0.9rem;
          color: #666;
        }

        .dimensions {
          font-size: 0.8rem;
          color: #888;
        }

        .projects-results {
          display: grid;
          gap: 20px;
        }
      `}</style>
    </div>
  );
}
