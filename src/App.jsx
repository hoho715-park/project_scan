import { useState } from 'react';
import { Scan, Play, HelpCircle, RotateCcw } from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import ZipUploader from './components/ZipUploader';
import ResultsDisplay from './components/ResultsDisplay';
import EvaluationCriteria from './components/EvaluationCriteria';
import LoadingScreen from './components/LoadingScreen';
import { compareProjects } from './utils/similarityAnalyzer';
import './App.css';

function App() {
  const [referenceImage, setReferenceImage] = useState(null);
  const [projects, setProjects] = useState([]);
  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCriteria, setShowCriteria] = useState(false);

  const canAnalyze = referenceImage && projects.length >= 1;

  const handleAnalyze = async () => {
    if (!canAnalyze) return;

    setIsAnalyzing(true);
    setResults(null);

    try {
      // 최소 로딩 시간 보장 (애니메이션을 위해)
      const minLoadingTime = new Promise(resolve => setTimeout(resolve, 6000));

      const analysisPromise = compareProjects(referenceImage, projects);

      const [analysisResults] = await Promise.all([analysisPromise, minLoadingTime]);

      // 기준 이미지 파일 참조 추가
      analysisResults.referenceImage.file = referenceImage;
      setResults(analysisResults);
    } catch (error) {
      console.error('분석 중 오류 발생:', error);
      alert('분석 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setReferenceImage(null);
    setProjects([]);
    setResults(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <Scan size={36} />
            <h1>Project Scan</h1>
          </div>
          <p className="tagline">UI 디자인과 프로젝트 코드의 유사도를 분석합니다</p>
        </div>
        <button className="help-btn" onClick={() => setShowCriteria(true)}>
          <HelpCircle size={20} />
          평가 기준
        </button>
      </header>

      <main className="app-main">
        {!results ? (
          <>
            <div className="upload-section">
              <div className="upload-grid">
                <ImageUploader
                  onImageSelect={setReferenceImage}
                  selectedImage={referenceImage}
                />
                <ZipUploader
                  projects={projects}
                  onProjectsChange={setProjects}
                  maxProjects={4}
                />
              </div>
            </div>

            <div className="action-section">
              <button
                className={`analyze-btn ${canAnalyze ? 'active' : ''}`}
                onClick={handleAnalyze}
                disabled={!canAnalyze || isAnalyzing}
              >
                <Play size={24} />
                분석 시작
              </button>
              {!canAnalyze && (
                <p className="help-text">
                  기준 UI 이미지와 최소 1개의 프로젝트 ZIP 파일을 업로드하세요
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="results-section">
            <ResultsDisplay results={results} originalProjects={projects} />
            <div className="reset-section">
              <button className="reset-btn" onClick={handleReset}>
                <RotateCcw size={20} />
                새로운 분석 시작
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Project Scan - UI 유사도 분석 도구</p>
      </footer>

      {isAnalyzing && <LoadingScreen projectCount={projects.length} />}

      <EvaluationCriteria
        isOpen={showCriteria}
        onClose={() => setShowCriteria(false)}
      />
    </div>
  );
}

export default App;
