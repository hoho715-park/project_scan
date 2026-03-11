import { FileCode, GitBranch, Layers, Package, AlertCircle } from 'lucide-react';

const PROJECT_COLORS = [
  { bg: '#dcfce7', border: '#22c55e', text: '#166534' },
  { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' },
  { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
  { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
];

const METRICS = [
  { key: 'totalLOC', label: 'Total LOC', description: '총 코드 라인 수', icon: FileCode },
  { key: 'avgCyclomaticComplexity', label: 'avg CC', description: '평균 순환 복잡도', icon: GitBranch },
  { key: 'avgCBO', label: 'avg CBO', description: '평균 결합도', icon: Package },
  { key: 'totalFiles', label: '분석 파일', description: '분석된 파일 수', icon: Layers },
];

function MetricCard({ label, value, description, icon: Icon, color }) {
  return (
    <div className="metric-card">
      <div className="metric-icon" style={{ backgroundColor: color }}>
        <Icon size={20} />
      </div>
      <div className="metric-content">
        <span className="metric-label">{label}</span>
        <span className="metric-value">{value}</span>
        <span className="metric-desc">{description}</span>
      </div>

      <style>{`
        .metric-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: white;
          border-radius: 12px;
          border: 1px solid var(--gray-200, #e2e8f0);
        }

        .metric-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .metric-content {
          display: flex;
          flex-direction: column;
        }

        .metric-label {
          font-size: 0.8rem;
          color: var(--gray-500, #64748b);
        }

        .metric-value {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--gray-800, #1e293b);
        }

        .metric-desc {
          font-size: 0.75rem;
          color: var(--gray-400, #94a3b8);
        }
      `}</style>
    </div>
  );
}

function SingleProjectView({ project }) {
  const colorScheme = PROJECT_COLORS[0];

  if (project.error) {
    return (
      <div className="error-card">
        <AlertCircle size={24} />
        <h4>{project.name}</h4>
        <p>{project.error}</p>
      </div>
    );
  }

  const { summary } = project;

  return (
    <div className="single-project">
      <div className="project-header" style={{ borderColor: colorScheme.border }}>
        <h3 style={{ color: colorScheme.text }}>{project.name}</h3>
        <span className="badge" style={{ backgroundColor: colorScheme.bg, color: colorScheme.text }}>
          코드 품질 정리
        </span>
      </div>

      <div className="metrics-grid">
        <MetricCard
          label="Total LOC"
          value={summary.totalLOC.toLocaleString()}
          description="총 코드 라인 수"
          icon={FileCode}
          color="#6366f1"
        />
        <MetricCard
          label="avg CC"
          value={summary.avgCyclomaticComplexity.toFixed(2)}
          description="평균 순환 복잡도"
          icon={GitBranch}
          color="#ec4899"
        />
        <MetricCard
          label="avg CBO"
          value={summary.avgCBO}
          description="평균 결합도"
          icon={Package}
          color="#f59e0b"
        />
        <MetricCard
          label="분석 파일"
          value={`${summary.totalFiles}개`}
          description="분석된 파일 수"
          icon={Layers}
          color="#10b981"
        />
      </div>

      <style>{`
        .single-project {
          background: white;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid var(--gray-200, #e2e8f0);
        }

        .project-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid;
        }

        .project-header h3 {
          font-size: 1.5rem;
          margin: 0;
        }

        .badge {
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .error-card {
          background: #fef2f2;
          border: 2px solid #ef4444;
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          color: #991b1b;
        }

        .error-card h4 {
          margin: 12px 0 8px;
        }

        .error-card p {
          margin: 0;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}

function ComparisonTable({ projects }) {
  const validProjects = projects.filter(p => !p.error);

  if (validProjects.length === 0) {
    return <p>분석할 수 있는 프로젝트가 없습니다.</p>;
  }

  return (
    <div className="comparison-table-container">
      <table className="comparison-table">
        <thead>
          <tr>
            <th className="metric-header">지표</th>
            {validProjects.map((project, index) => (
              <th
                key={project.id}
                style={{
                  backgroundColor: PROJECT_COLORS[index].bg,
                  color: PROJECT_COLORS[index].text,
                }}
              >
                {project.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="metric-name">
              <FileCode size={16} />
              <span>Total LOC</span>
              <small>총 코드 라인 수</small>
            </td>
            {validProjects.map((project, index) => (
              <td key={project.id} className="metric-cell">
                <span className="cell-value" style={{ color: PROJECT_COLORS[index].text }}>
                  {project.summary.totalLOC.toLocaleString()}
                </span>
              </td>
            ))}
          </tr>
          <tr>
            <td className="metric-name">
              <GitBranch size={16} />
              <span>avg CC</span>
              <small>평균 순환 복잡도</small>
            </td>
            {validProjects.map((project, index) => (
              <td key={project.id} className="metric-cell">
                <span className="cell-value" style={{ color: PROJECT_COLORS[index].text }}>
                  {project.summary.avgCyclomaticComplexity.toFixed(2)}
                </span>
              </td>
            ))}
          </tr>
          <tr>
            <td className="metric-name">
              <Package size={16} />
              <span>avg CBO</span>
              <small>평균 결합도</small>
            </td>
            {validProjects.map((project, index) => (
              <td key={project.id} className="metric-cell">
                <span className="cell-value" style={{ color: PROJECT_COLORS[index].text }}>
                  {project.summary.avgCBO}
                </span>
              </td>
            ))}
          </tr>
          <tr>
            <td className="metric-name">
              <Layers size={16} />
              <span>분석 파일</span>
              <small>분석된 파일 수</small>
            </td>
            {validProjects.map((project, index) => (
              <td key={project.id} className="metric-cell">
                <span className="cell-value" style={{ color: PROJECT_COLORS[index].text }}>
                  {project.summary.totalFiles}개
                </span>
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <style>{`
        .comparison-table-container {
          overflow-x: auto;
        }

        .comparison-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .comparison-table th,
        .comparison-table td {
          padding: 16px 20px;
          text-align: center;
          border-bottom: 1px solid var(--gray-200, #e2e8f0);
        }

        .comparison-table th {
          font-weight: 600;
          font-size: 1rem;
        }

        .metric-header {
          background: var(--gray-100, #f1f5f9);
          color: var(--gray-600, #475569);
          text-align: left !important;
          width: 200px;
        }

        .metric-name {
          display: flex;
          align-items: center;
          gap: 10px;
          text-align: left !important;
          background: var(--gray-50, #f8fafc);
        }

        .metric-name span {
          font-weight: 600;
          color: var(--gray-700, #334155);
        }

        .metric-name small {
          display: block;
          font-size: 0.75rem;
          color: var(--gray-400, #94a3b8);
          font-weight: normal;
        }

        .metric-name svg {
          color: var(--secondary, #6366f1);
          flex-shrink: 0;
        }

        .metric-cell {
          background: white;
        }

        .cell-value {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .comparison-table tbody tr:hover td {
          background: var(--gray-50, #f8fafc);
        }

        .comparison-table tbody tr:last-child td {
          border-bottom: none;
        }
      `}</style>
    </div>
  );
}

export default function QualityResultsDisplay({ results }) {
  if (!results || !results.projects) return null;

  const { projects } = results;

  return (
    <div className="quality-results">
      <div className="results-header">
        <h2>코드 품질 분석 결과</h2>
        <p>총 {projects.length}개 프로젝트 분석 완료</p>
      </div>

      {projects.length === 1 ? (
        <SingleProjectView project={projects[0]} />
      ) : (
        <ComparisonTable projects={projects} />
      )}

      <div className="metrics-info">
        <h4>지표 설명</h4>
        <ul>
          <li><strong>Total LOC</strong> - 총 코드 라인 수 (Lines of Code). 주석과 빈 줄을 제외한 실제 코드 라인</li>
          <li><strong>avg CC</strong> - 평균 순환 복잡도 (Cyclomatic Complexity). 낮을수록 코드가 단순함 (1-10: 좋음, 10-20: 보통, 20+: 복잡)</li>
          <li><strong>avg CBO</strong> - 평균 결합도 (Coupling Between Objects). 파일당 평균 의존성 수. 낮을수록 모듈화가 잘 됨</li>
          <li><strong>분석 파일</strong> - 분석에 포함된 코드 파일 수</li>
        </ul>
      </div>

      <style>{`
        .quality-results {
          background: white;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
          border: 1px solid var(--gray-200, #e2e8f0);
        }

        .results-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .results-header h2 {
          font-size: 1.8rem;
          color: var(--gray-800, #1e293b);
          margin-bottom: 8px;
        }

        .results-header p {
          color: var(--gray-500, #64748b);
        }

        .metrics-info {
          margin-top: 32px;
          padding: 20px;
          background: var(--gray-50, #f8fafc);
          border-radius: 12px;
          border: 1px solid var(--gray-200, #e2e8f0);
        }

        .metrics-info h4 {
          margin: 0 0 12px;
          color: var(--gray-700, #334155);
          font-size: 1rem;
        }

        .metrics-info ul {
          margin: 0;
          padding-left: 20px;
        }

        .metrics-info li {
          color: var(--gray-600, #475569);
          font-size: 0.9rem;
          margin-bottom: 8px;
          line-height: 1.5;
        }

        .metrics-info li:last-child {
          margin-bottom: 0;
        }

        .metrics-info strong {
          color: var(--gray-800, #1e293b);
        }
      `}</style>
    </div>
  );
}
