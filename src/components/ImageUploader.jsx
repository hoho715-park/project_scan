import { useRef, useState } from 'react';
import { Upload, Image, X } from 'lucide-react';

export default function ImageUploader({ onImageSelect, selectedImage }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);

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

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    onImageSelect(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-uploader">
      <h3 className="uploader-title">
        <Image size={20} />
        기준 UI 이미지
      </h3>
      <p className="uploader-description">
        비교 기준이 될 UI 디자인 이미지를 업로드하세요
      </p>

      {!preview ? (
        <div
          className={`upload-zone ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={48} className="upload-icon" />
          <p className="upload-text">
            클릭하거나 이미지를 드래그하여 업로드
          </p>
          <p className="upload-hint">
            PNG, JPG, GIF 등 이미지 파일 지원
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        <div className="preview-container">
          <img src={preview} alt="기준 UI 미리보기" className="preview-image" />
          <button className="remove-button" onClick={handleRemove}>
            <X size={16} />
            제거
          </button>
          <p className="file-name">{selectedImage?.name}</p>
        </div>
      )}

      <style>{`
        .image-uploader {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

        .upload-zone {
          border: 2px dashed #667eea;
          border-radius: 12px;
          padding: 40px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #f8f9ff;
        }

        .upload-zone:hover,
        .upload-zone.dragging {
          border-color: #764ba2;
          background: #f0f0ff;
        }

        .upload-icon {
          color: #667eea;
          margin-bottom: 16px;
        }

        .upload-text {
          font-size: 1rem;
          color: #333;
          margin-bottom: 8px;
        }

        .upload-hint {
          font-size: 0.85rem;
          color: #888;
        }

        .preview-container {
          position: relative;
          text-align: center;
        }

        .preview-image {
          max-width: 100%;
          max-height: 300px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .remove-button {
          position: absolute;
          top: 8px;
          right: 8px;
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 6px;
          padding: 6px 12px;
          cursor: pointer;
          font-size: 0.85rem;
          color: #e74c3c;
          transition: all 0.2s ease;
        }

        .remove-button:hover {
          background: #e74c3c;
          color: white;
        }

        .file-name {
          margin-top: 12px;
          font-size: 0.85rem;
          color: #666;
        }
      `}</style>
    </div>
  );
}
