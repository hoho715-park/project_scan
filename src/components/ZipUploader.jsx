import { useRef, useState } from 'react';
import { FolderArchive, Plus, X, User, ImagePlus } from 'lucide-react';

const PROJECT_COLORS = [
  { bg: '#dcfce7', border: '#22c55e', text: '#166534' },
  { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' },
  { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
  { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
];

export default function ZipUploader({ projects, onProjectsChange, maxProjects = 4 }) {
  const fileInputRef = useRef(null);
  const imageInputRefs = useRef({});
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const zipFiles = files.filter(
      (file) =>
        file.type === 'application/zip' ||
        file.type === 'application/x-zip-compressed' ||
        file.name.endsWith('.zip')
    );

    if (zipFiles.length === 0) {
      alert('ZIP 파일만 업로드할 수 있습니다.');
      return;
    }

    const remainingSlots = maxProjects - projects.length;
    const filesToAdd = zipFiles.slice(0, remainingSlots);

    if (zipFiles.length > remainingSlots) {
      alert(`최대 ${maxProjects}개의 프로젝트만 업로드할 수 있습니다. ${filesToAdd.length}개만 추가됩니다.`);
    }

    const newProjects = filesToAdd.map((file, index) => ({
      id: Date.now() + index,
      file,
      name: file.name.replace('.zip', ''),
      displayName: `프로젝트 ${String.fromCharCode(65 + projects.length + index)}`,
      resultImage: null,
      resultImagePreview: null,
    }));

    onProjectsChange([...projects, ...newProjects]);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveProject = (id) => {
    const updatedProjects = projects.filter((p) => p.id !== id);
    const renamedProjects = updatedProjects.map((p, index) => ({
      ...p,
      displayName: `프로젝트 ${String.fromCharCode(65 + index)}`,
    }));
    onProjectsChange(renamedProjects);
  };

  const handleNameChange = (id, newName) => {
    const updatedProjects = projects.map((p) =>
      p.id === id ? { ...p, displayName: newName } : p
    );
    onProjectsChange(updatedProjects);
  };

  const handleImageSelect = (projectId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const updatedProjects = projects.map((p) =>
        p.id === projectId
          ? { ...p, resultImage: file, resultImagePreview: e.target.result }
          : p
      );
      onProjectsChange(updatedProjects);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (projectId) => {
    const updatedProjects = projects.map((p) =>
      p.id === projectId
        ? { ...p, resultImage: null, resultImagePreview: null }
        : p
    );
    onProjectsChange(updatedProjects);
  };

  const canAddMore = projects.length < maxProjects;

  return (
    <div className="zip-uploader">
      <h3 className="uploader-title">
        <FolderArchive size={20} />
        프로젝트 ZIP 파일
      </h3>
      <p className="uploader-description">
        비교할 프로젝트 ZIP 파일을 업로드하세요 (최대 {maxProjects}개)
      </p>

      {projects.length > 0 && (
        <div className="projects-list">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="project-card"
              style={{
                backgroundColor: PROJECT_COLORS[index].bg,
                borderColor: PROJECT_COLORS[index].border,
              }}
            >
              <div className="project-header">
                <div
                  className="project-badge"
                  style={{ backgroundColor: PROJECT_COLORS[index].border }}
                >
                  <User size={14} />
                </div>
                <input
                  type="text"
                  className="project-name-input"
                  value={project.displayName}
                  onChange={(e) => handleNameChange(project.id, e.target.value)}
                  style={{ color: PROJECT_COLORS[index].text }}
                />
                <button
                  className="remove-project-btn"
                  onClick={() => handleRemoveProject(project.id)}
                >
                  <X size={16} />
                </button>
              </div>
              <p className="project-filename">{project.name}.zip</p>

              {/* 결과 이미지 업로드 영역 */}
              <div className="result-image-section">
                {!project.resultImagePreview ? (
                  <div
                    className="image-upload-zone"
                    onClick={() => imageInputRefs.current[project.id]?.click()}
                  >
                    <ImagePlus size={20} />
                    <span>결과 스크린샷 추가</span>
                    <input
                      ref={(el) => (imageInputRefs.current[project.id] = el)}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageSelect(project.id, e)}
                      style={{ display: 'none' }}
                    />
                  </div>
                ) : (
                  <div className="image-preview-container">
                    <img
                      src={project.resultImagePreview}
                      alt="결과 이미지"
                      className="result-image-preview"
                    />
                    <button
                      className="remove-image-btn"
                      onClick={() => handleRemoveImage(project.id)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {canAddMore && (
        <div
          className={`upload-zone ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Plus size={32} className="upload-icon" />
          <p className="upload-text">
            {projects.length === 0
              ? 'ZIP 파일을 드래그하거나 클릭하여 업로드'
              : '추가 프로젝트 업로드'}
          </p>
          <p className="upload-hint">
            {maxProjects - projects.length}개 더 추가 가능
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".zip,application/zip,application/x-zip-compressed"
            multiple
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
      )}

      {!canAddMore && (
        <div className="max-reached">
          최대 프로젝트 수에 도달했습니다
        </div>
      )}

      <style>{`
        .zip-uploader {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
        }

        .uploader-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.25rem;
          color: #1a1a2e;
          margin-bottom: 8px;
        }

        .uploader-description {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 16px;
        }

        .projects-list {
          display: grid;
          gap: 12px;
          margin-bottom: 16px;
        }

        .project-card {
          border: 2px solid;
          border-radius: 12px;
          padding: 12px 16px;
          transition: all 0.2s ease;
        }

        .project-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .project-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .project-badge {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .project-name-input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 1rem;
          font-weight: 600;
          outline: none;
        }

        .project-name-input:focus {
          background: rgba(255, 255, 255, 0.5);
          border-radius: 4px;
          padding: 2px 6px;
          margin: -2px -6px;
        }

        .remove-project-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          color: #999;
          transition: color 0.2s ease;
        }

        .remove-project-btn:hover {
          color: #e74c3c;
        }

        .project-filename {
          margin-top: 4px;
          font-size: 0.8rem;
          color: #888;
          margin-left: 38px;
        }

        .result-image-section {
          margin-top: 12px;
          margin-left: 38px;
        }

        .image-upload-zone {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border: 2px dashed rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #666;
          font-size: 0.85rem;
        }

        .image-upload-zone:hover {
          border-color: var(--primary-dark, #22c55e);
          color: var(--primary-dark, #22c55e);
          background: rgba(34, 197, 94, 0.05);
        }

        .image-preview-container {
          position: relative;
          display: inline-block;
        }

        .result-image-preview {
          max-width: 100%;
          max-height: 120px;
          border-radius: 8px;
          border: 2px solid rgba(0, 0, 0, 0.1);
        }

        .remove-image-btn {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #e74c3c;
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        }

        .remove-image-btn:hover {
          transform: scale(1.1);
        }

        .upload-zone {
          border: 2px dashed var(--primary-dark, #22c55e);
          border-radius: 12px;
          padding: 30px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #f0fdf4;
        }

        .upload-zone:hover,
        .upload-zone.dragging {
          border-color: var(--secondary, #059669);
          background: #dcfce7;
        }

        .upload-icon {
          color: var(--primary-dark, #22c55e);
          margin-bottom: 12px;
        }

        .upload-text {
          font-size: 0.95rem;
          color: #333;
          margin-bottom: 6px;
        }

        .upload-hint {
          font-size: 0.8rem;
          color: #888;
        }

        .max-reached {
          text-align: center;
          padding: 16px;
          background: #f0fdf4;
          border-radius: 8px;
          color: #166534;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
