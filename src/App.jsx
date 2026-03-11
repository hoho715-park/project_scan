import { useState } from 'react';
import { Scan, Play, HelpCircle, RotateCcw, ArrowLeft } from 'lucide-react';
import ModeSelector from './components/ModeSelector';
import ImageUploader from './components/ImageUploader';
import ZipUploader from './components/ZipUploader';
import ImageCompareUploader from './components/ImageCompareUploader';
import ResultsDisplay from './components/ResultsDisplay';
import ImageResultsDisplay from './components/ImageResultsDisplay';
import QualityResultsDisplay from './components/QualityResultsDisplay';
import EvaluationCriteria from './components/EvaluationCriteria';
import LoadingScreen from './components/LoadingScreen';
import { compareProjects } from './utils/similarityAnalyzer';
import { compareMultipleImages } from './utils/imageComparator';
import { compareProjectsQuality } from './utils/codeQualityAnalyzer';
import './App.css';

function App() {
  // 모드: null(선택전), 'code', 'image'
  const [mode, setMode] = useState(null);

  // 코드 비교용 상태
  const [referenceImage, setReferenceImage] = useState(null);
  const [projects, setProjects] = useState([]);

  // 이미지 비교용 상태
  const [imageReference, setImageReference] = useState(null);
  const [projectImages, setProjectImages] = useState([]);

  // 코드 품질 비교용 상태
  const [qualityProjects, setQualityProjects] = useState([]);

  // 공통 상태
  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCriteria, setShowCriteria] = useState(false);

  const canAnalyzeCode = referenceImage && projects.length >= 1;
  const canAnalyzeImage = imageReference && projectImages.length >= 1;
  const canAnalyzeQuality = qualityProjects.length >= 1;

  const handleAnalyzeCode = async () => {
    if (!canAnalyzeCode) return;

    setIsAnalyzing(true);
    setResults(null);

    try {
      const minLoadingTime = new Promise(resolve => setTimeout(resolve, 6000));
      const analysisPromise = compareProjects(referenceImage, projects);
      const [analysisResults] = await Promise.all([analysisPromise, minLoadingTime]);

      analysisResults.referenceImage.file = referenceImage;
      setResults(analysisResults);
    } catch (error) {
      console.error('분석 중 오류 발생:', error);
      alert('분석 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!canAnalyzeImage) return;

    setIsAnalyzing(true);
    setResults(null);

    try {
      const minLoadingTime = new Promise(resolve => setTimeout(resolve, 4000));
      const analysisPromise = compareMultipleImages(imageReference.file, projectImages);
      const [analysisResults] = await Promise.all([analysisPromise, minLoadingTime]);

      setResults(analysisResults);
    } catch (error) {
      console.error('분석 중 오류 발생:', error);
      alert('분석 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeQuality = async () => {
    if (!canAnalyzeQuality) return;

    setIsAnalyzing(true);
    setResults(null);

    try {
      const minLoadingTime = new Promise(resolve => setTimeout(resolve, 3000));
      const analysisPromise = compareProjectsQuality(qualityProjects);
      const [analysisResults] = await Promise.all([analysisPromise, minLoadingTime]);

      setResults(analysisResults);
    } catch (error) {
      console.error('분석 중 오류 발생:', error);
      alert('분석 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResults(null);
  };

  const handleBackToModeSelect = () => {
    setMode(null);
    setReferenceImage(null);
    setProjects([]);
    setImageReference(null);
    setProjectImages([]);
    setQualityProjects([]);
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
          <p className="tagline">UI 디자인과 프로젝트의 유사도를 분석합니다</p>
        </div>
        <div className="header-actions">
          {mode && (
            <button className="back-btn" onClick={handleBackToModeSelect}>
              <ArrowLeft size={18} />
              모드 선택
            </button>
          )}
          <button className="help-btn" onClick={() => setShowCriteria(true)}>
            <HelpCircle size={20} />
            평가 기준
          </button>
        </div>
      </header>

      <main className="app-main">
        {/* 모드 선택 화면 */}
        {!mode && <ModeSelector onSelectMode={setMode} />}

        {/* 코드 비교 모드 */}
        {mode === 'code' && !results && (
          <>
            <div className="mode-badge code">코드로 비교하기</div>
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
                className={`analyze-btn ${canAnalyzeCode ? 'active' : ''}`}
                onClick={handleAnalyzeCode}
                disabled={!canAnalyzeCode || isAnalyzing}
              >
                <Play size={24} />
                코드 분석 시작
              </button>
              {!canAnalyzeCode && (
                <p className="help-text">
                  기준 UI 이미지와 최소 1개의 프로젝트 ZIP 파일을 업로드하세요
                </p>
              )}
            </div>
          </>
        )}

        {/* 이미지 비교 모드 */}
        {mode === 'image' && !results && (
          <>
            <div className="mode-badge image">이미지로 비교하기</div>
            <div className="upload-section">
              <ImageCompareUploader
                referenceImage={imageReference}
                onReferenceChange={setImageReference}
                projectImages={projectImages}
                onProjectImagesChange={setProjectImages}
                maxProjects={4}
              />
            </div>

            <div className="action-section">
              <button
                className={`analyze-btn image ${canAnalyzeImage ? 'active' : ''}`}
                onClick={handleAnalyzeImage}
                disabled={!canAnalyzeImage || isAnalyzing}
              >
                <Play size={24} />
                이미지 분석 시작
              </button>
              {!canAnalyzeImage && (
                <p className="help-text">
                  기준 이미지와 최소 1개의 프로젝트 결과 이미지를 업로드하세요
                </p>
              )}
            </div>
          </>
        )}

        {/* 코드 품질 비교 모드 */}
        {mode === 'quality' && !results && (
          <>
            <div className="mode-badge quality">코드 품질 비교</div>
            <div className="upload-section">
              <ZipUploader
                projects={qualityProjects}
                onProjectsChange={setQualityProjects}
                maxProjects={4}
                hideResultImage={true}
              />
            </div>

            <div className="action-section">
              <button
                className={`analyze-btn quality ${canAnalyzeQuality ? 'active' : ''}`}
                onClick={handleAnalyzeQuality}
                disabled={!canAnalyzeQuality || isAnalyzing}
              >
                <Play size={24} />
                품질 분석 시작
              </button>
              {!canAnalyzeQuality && (
                <p className="help-text">
                  최소 1개의 프로젝트 ZIP 파일을 업로드하세요
                </p>
              )}
            </div>
          </>
        )}

        {/* 코드 비교 결과 */}
        {mode === 'code' && results && (
          <div className="results-section">
            <ResultsDisplay results={results} originalProjects={projects} />
            <div className="reset-section">
              <button className="reset-btn" onClick={handleReset}>
                <RotateCcw size={20} />
                다시 분석하기
              </button>
              <button className="reset-btn secondary" onClick={handleBackToModeSelect}>
                <ArrowLeft size={20} />
                모드 선택으로
              </button>
            </div>
          </div>
        )}

        {/* 이미지 비교 결과 */}
        {mode === 'image' && results && (
          <div className="results-section">
            <ImageResultsDisplay results={results} referenceImage={imageReference} />
            <div className="reset-section">
              <button className="reset-btn" onClick={handleReset}>
                <RotateCcw size={20} />
                다시 분석하기
              </button>
              <button className="reset-btn secondary" onClick={handleBackToModeSelect}>
                <ArrowLeft size={20} />
                모드 선택으로
              </button>
            </div>
          </div>
        )}

        {/* 코드 품질 비교 결과 */}
        {mode === 'quality' && results && (
          <div className="results-section">
            <QualityResultsDisplay results={results} />
            <div className="reset-section">
              <button className="reset-btn quality" onClick={handleReset}>
                <RotateCcw size={20} />
                다시 분석하기
              </button>
              <button className="reset-btn secondary" onClick={handleBackToModeSelect}>
                <ArrowLeft size={20} />
                모드 선택으로
              </button>
            </div>
          </div>
        )}
      </main>

      {isAnalyzing && (
        <LoadingScreen
          projectCount={mode === 'code' ? projects.length : mode === 'quality' ? qualityProjects.length : projectImages.length}
          mode={mode}
        />
      )}

      <EvaluationCriteria
        isOpen={showCriteria}
        onClose={() => setShowCriteria(false)}
      />
    </div>
  );
}

export default App;
