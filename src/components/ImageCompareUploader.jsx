import { useRef, useState } from 'react';
import { Upload, Image, X, Plus, User } from 'lucide-react';

const PROJECT_COLORS = [
  { bg: '#dcfce7', border: '#22c55e', text: '#166534' },
  { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' },
  { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
  { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
];

export default function ImageCompareUploader({
  referenceImage,
  onReferenceChange,
  projectImages,
  onProjectImagesChange,
  maxProjects = 4,
}) {
  const refInputRef = useRef(null);
  const projectInputRefs = useRef({});
  const [isDraggingRef, setIsDraggingRef] = useState(false);
  const [isDraggingProject, setIsDraggingProject] = useState(false);

  // 기준 이미지 처리
  const handleRefFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onReferenceChange({
        file,
        name: file.name,
        previewUrl: e.target.result,
      });
    };
    reader.readAsDataURL(file);
  };

  // 프로젝트 이미지 추가
  const handleProjectFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    if (projectImages.length >= maxProjects) {
      alert(`최대 ${maxProjects}개의 프로젝트만 비교할 수 있습니다.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const newProject = {
        id: Date.now(),
        file,
        name: file.name.replace(/\.[^/.]+$/, ''),
        displayName: `프로젝트 ${String.fromCharCode(65 + projectImages.length)}`,
        previewUrl: e.target.result,
      };
      onProjectImagesChange([...projectImages, newProject]);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveProject = (id) => {
    const updated = projectImages.filter(p => p.id !== id);
    const renamed = updated.map((p, index) => ({
      ...p,
      displayName: `프로젝트 ${String.fromCharCode(65 + index)}`,
    }));
    onProjectImagesChange(renamed);
  };

  const handleNameChange = (id, newName) => {
    const updated = projectImages.map(p =>
      p.id === id ? { ...p, displayName: newName } : p
    );
    onProjectImagesChange(updated);
  };

  return (
    <div className="image-compare-uploader">
      {/* 기준 이미지 업로드 */}
      <div className="upload-section">
        <h3>
          <Image size={20} />
          기준 UI 이미지
        </h3>
        <p>비교 기준이 될 UI 디자인 이미지를 업로드하세요</p>

        {!referenceImage ? (
          <div
            className={`upload-zone reference ${isDraggingRef ? 'dragging' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDraggingRef(true); }}
            onDragLeave={() => setIsDraggingRef(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingRef(false);
              if (e.dataTransfer.files[0]) handleRefFile(e.dataTransfer.files[0]);
            }}
            onClick={() => refInputRef.current?.click()}
          >
            <Upload size={48} className="upload-icon" />
            <p>클릭하거나 이미지를 드래그하여 업로드</p>
            <input
              ref={refInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files[0] && handleRefFile(e.target.files[0])}
              style={{ display: 'none' }}
            />
          </div>
        ) : (
          <div className="preview-box reference">
            <img src={referenceImage.previewUrl} alt="기준 이미지" />
            <button className="remove-btn" onClick={() => onReferenceChange(null)}>
              <X size={16} />
            </button>
            <p className="file-name">{referenceImage.name}</p>
          </div>
        )}
      </div>

      {/* 프로젝트 이미지 업로드 */}
      <div className="upload-section">
        <h3>
          <Image size={20} />
          프로젝트 결과 이미지
        </h3>
        <p>비교할 프로젝트 결과 스크린샷을 업로드하세요 (최대 {maxProjects}개)</p>

        <div className="projects-grid">
          {projectImages.map((project, index) => (
            <div
              key={project.id}
              className="project-image-card"
              style={{
                backgroundColor: PROJECT_COLORS[index].bg,
                borderColor: PROJECT_COLORS[index].border,
              }}
            >
              <div className="card-header">
                <div
                  className="project-badge"
                  style={{ backgroundColor: PROJECT_COLORS[index].border }}
                >
                  <User size={12} />
                </div>
                <input
                  type="text"
                  value={project.displayName}
                  onChange={(e) => handleNameChange(project.id, e.target.value)}
                  style={{ color: PROJECT_COLORS[index].text }}
                />
                <button onClick={() => handleRemoveProject(project.id)}>
                  <X size={16} />
                </button>
              </div>
              <img src={project.previewUrl} alt={project.displayName} />
              <p className="file-name">{project.name}</p>
            </div>
          ))}

          {projectImages.length < maxProjects && (
            <div
              className={`upload-zone project ${isDraggingProject ? 'dragging' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setIsDraggingProject(true); }}
              onDragLeave={() => setIsDraggingProject(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingProject(false);
                if (e.dataTransfer.files[0]) handleProjectFile(e.dataTransfer.files[0]);
              }}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                  if (e.target.files[0]) handleProjectFile(e.target.files[0]);
                };
                input.click();
              }}
            >
              <Plus size={32} />
              <p>프로젝트 이미지 추가</p>
              <span>{maxProjects - projectImages.length}개 더 추가 가능</span>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .image-compare-uploader {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
        }

        .upload-section {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
        }

        .upload-section h3 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.25rem;
          color: #1a1a2e;
          margin-bottom: 8px;
        }

        .upload-section > p {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 16px;
        }

        .upload-zone {
          border: 2px dashed #3b82f6;
          border-radius: 12px;
          padding: 40px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #eff6ff;
        }

        .upload-zone.reference {
          border-color: #22c55e;
          background: #f0fdf4;
        }

        .upload-zone:hover,
        .upload-zone.dragging {
          background: #dbeafe;
          border-color: #2563eb;
        }

        .upload-zone.reference:hover,
        .upload-zone.reference.dragging {
          background: #dcfce7;
          border-color: #16a34a;
        }

        .upload-zone .upload-icon {
          color: #22c55e;
          margin-bottom: 16px;
        }

        .upload-zone p {
          color: #333;
          margin-bottom: 4px;
        }

        .upload-zone span {
          font-size: 0.85rem;
          color: #888;
        }

        .preview-box {
          position: relative;
          text-align: center;
        }

        .preview-box img {
          max-width: 100%;
          max-height: 250px;
          border-radius: 8px;
          border: 2px solid #22c55e;
        }

        .preview-box .remove-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(239, 68, 68, 0.9);
          color: white;
          border: none;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .preview-box .file-name {
          margin-top: 8px;
          font-size: 0.85rem;
          color: #666;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 16px;
        }

        .project-image-card {
          border: 2px solid;
          border-radius: 12px;
          padding: 12px;
          transition: all 0.2s ease;
        }

        .project-image-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .project-badge {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .card-header input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 0.9rem;
          font-weight: 600;
          outline: none;
          min-width: 0;
        }

        .card-header button {
          background: none;
          border: none;
          cursor: pointer;
          color: #999;
          padding: 2px;
        }

        .card-header button:hover {
          color: #ef4444;
        }

        .project-image-card img {
          width: 100%;
          height: 120px;
          object-fit: cover;
          border-radius: 8px;
        }

        .project-image-card .file-name {
          margin-top: 8px;
          font-size: 0.75rem;
          color: #888;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .upload-zone.project {
          min-height: 180px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .upload-zone.project svg {
          color: #3b82f6;
          margin-bottom: 8px;
        }

        @media (max-width: 900px) {
          .image-compare-uploader {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
