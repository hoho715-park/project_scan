import { Trophy, Medal, Star, ChevronDown, ChevronUp, Eye, Palette, Grid3X3, Scan } from 'lucide-react';
import { useState } from 'react';

const PROJECT_COLORS = [
  { bg: '#dcfce7', border: '#22c55e', text: '#166534', gradient: 'linear-gradient(135deg, #22c55e, #16a34a)' },
  { bg: '#fee2e2', border: '#ef4444', text: '#991b1b', gradient: 'linear-gradient(135deg, #ef4444, #dc2626)' },
  { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af', gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
  { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
];

const RANK_ICONS = [
  { icon: Trophy, color: '#ffd700' },
  { icon: Medal, color: '#c0c0c0' },
  { icon: Medal, color: '#cd7f32' },
  { icon: Star, color: '#3b82f6' },
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
          stroke="#e0e0e0"
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
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <p className="breakdown-details">{details}</p>
    </div>
  );
}

function ProjectResult({ project, index, isExpanded, onToggle, referenceImage }) {
  const colorScheme = PROJECT_COLORS[index % PROJECT_COLORS.length];
  const RankIcon = RANK_ICONS[project.rank - 1]?.icon || Star;
  const rankColor = RANK_ICONS[project.rank - 1]?.color || '#3b82f6';

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
    <div className="project-result" style={{ borderColor: colorScheme.border }}>
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
          {/* 이미지 비교 섹션 */}
          <div className="image-comparison">
            <div className="compare-image">
              <h6>기준 이미지</h6>
              <img src={referenceImage.previewUrl} alt="기준" />
            </div>
            <div className="compare-arrow">VS</div>
            <div className="compare-image">
              <h6>프로젝트 결과</h6>
              <img src={project.previewUrl} alt={project.name} />
            </div>
          </div>

          <h5>세부 평가 항목</h5>
          <div className="breakdown-list">
            <BreakdownItem
              icon={Eye}
              title="픽셀 색상 일치도"
              score={project.breakdown.pixelSimilarity.score}
              maxScore={project.breakdown.pixelSimilarity.maxScore}
              details={project.breakdown.pixelSimilarity.details}
              color="#ec4899"
            />
            <BreakdownItem
              icon={Palette}
              title="색상 분포 유사도"
              score={project.breakdown.histogramSimilarity.score}
              maxScore={project.breakdown.histogramSimilarity.maxScore}
              details={project.breakdown.histogramSimilarity.details}
              color="#8b5cf6"
            />
            <BreakdownItem
              icon={Grid3X3}
              title="구조적 유사도"
              score={project.breakdown.structuralSimilarity.score}
              maxScore={project.breakdown.structuralSimilarity.maxScore}
              details={project.breakdown.structuralSimilarity.details}
              color="#06b6d4"
            />
            <BreakdownItem
              icon={Scan}
              title="윤곽선 유사도"
              score={project.breakdown.edgeSimilarity.score}
              maxScore={project.breakdown.edgeSimilarity.maxScore}
              details={project.breakdown.edgeSimilarity.details}
              color="#22c55e"
            />
          </div>
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
          border-top: 1px solid #e0e0e0;
          background: #fafafa;
        }

        .result-details h5 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 16px 0 12px;
          color: #333;
          font-size: 1rem;
        }

        .image-comparison {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          padding: 20px;
          background: white;
          border-radius: 12px;
          margin: 16px 0;
        }

        .compare-image {
          text-align: center;
        }

        .compare-image h6 {
          margin: 0 0 8px;
          font-size: 0.85rem;
          color: #666;
        }

        .compare-image img {
          max-width: 200px;
          max-height: 150px;
          border-radius: 8px;
          border: 2px solid #e0e0e0;
        }

        .compare-arrow {
          font-size: 1.5rem;
          font-weight: bold;
          color: #999;
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
          background: #e0e0e0;
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
      `}</style>
    </div>
  );
}

export default function ImageResultsDisplay({ results, referenceImage }) {
  const [expandedId, setExpandedId] = useState(null);

  if (!results) return null;

  const handleToggle = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="results-display">
      <div className="results-header">
        <h2>이미지 비교 결과</h2>
        <p>총 {results.projects.length}개 프로젝트 비교 완료</p>
      </div>

      <div className="reference-info">
        <img src={referenceImage.previewUrl} alt="기준 UI" className="reference-thumbnail" />
        <div>
          <h4>기준 UI 이미지</h4>
          <p>{referenceImage.name}</p>
        </div>
      </div>

      <div className="criteria-info">
        <h4>이미지 비교 기준</h4>
        <div className="criteria-grid">
          <div className="criteria-item">
            <Eye size={20} style={{ color: '#ec4899' }} />
            <div>
              <strong>픽셀 색상 일치도 (25점)</strong>
              <p>각 픽셀의 RGB 색상값을 직접 비교하여 MSE(평균 제곱 오차)를 계산</p>
            </div>
          </div>
          <div className="criteria-item">
            <Palette size={20} style={{ color: '#8b5cf6' }} />
            <div>
              <strong>색상 분포 유사도 (25점)</strong>
              <p>RGB 채널별 히스토그램을 생성하여 색상 분포의 상관계수 계산</p>
            </div>
          </div>
          <div className="criteria-item">
            <Grid3X3 size={20} style={{ color: '#06b6d4' }} />
            <div>
              <strong>구조적 유사도 (25점)</strong>
              <p>SSIM 알고리즘 기반으로 이미지를 블록 단위로 나누어 구조적 패턴 비교</p>
            </div>
          </div>
          <div className="criteria-item">
            <Scan size={20} style={{ color: '#22c55e' }} />
            <div>
              <strong>윤곽선 유사도 (25점)</strong>
              <p>Sobel 엣지 검출 후 윤곽선 패턴의 유사도 측정</p>
            </div>
          </div>
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
            referenceImage={referenceImage}
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
          color: #1e40af;
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
          background: linear-gradient(135deg, #dbeafe20, #eff6ff);
          border: 2px solid #dbeafe;
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .reference-thumbnail {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          border: 2px solid #3b82f6;
        }

        .reference-info h4 {
          margin: 0 0 4px;
          color: #1e40af;
        }

        .reference-info p {
          margin: 0;
          font-size: 0.9rem;
          color: #666;
        }

        .criteria-info {
          background: #f8fafc;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .criteria-info h4 {
          margin: 0 0 16px;
          color: #334155;
          font-size: 1.1rem;
        }

        .criteria-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }

        .criteria-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          background: white;
          border-radius: 8px;
        }

        .criteria-item strong {
          display: block;
          font-size: 0.9rem;
          color: #333;
          margin-bottom: 4px;
        }

        .criteria-item p {
          font-size: 0.8rem;
          color: #666;
          margin: 0;
          line-height: 1.4;
        }

        .projects-results {
          display: grid;
          gap: 20px;
        }
      `}</style>
    </div>
  );
}
