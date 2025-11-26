import { useState, useRef, useEffect } from 'react';
import type { ContentType } from '../types';
import { X, Plus, Upload } from 'lucide-react';

type TabType = 'url' | 'upload' | 'plain-text';

interface Props {
  contentTypeName: string;
  contentTypes: ContentType[];
  onSave: (name: string, url: string, content: string, type: TabType) => void;
  onCancel: () => void;
}

export const AddSampleModal = ({ onSave, onCancel }: Props) => {
  const [activeTab, setActiveTab] = useState<TabType>('url');
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [plainText, setPlainText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onCancel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onCancel]);

  const handleSave = () => {
    if (activeTab === 'url' && !url.trim()) return;
    if (activeTab === 'plain-text' && !plainText.trim()) return;
    if (activeTab === 'upload' && !file) return;

    const content = activeTab === 'url' ? url : activeTab === 'plain-text' ? plainText : file?.name || '';
    onSave(name.trim(), url.trim(), content, activeTab);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!name.trim()) {
        setName(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      setFile(droppedFile);
      if (!name.trim()) {
        setName(droppedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content add-sample-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Add Sample</h3>
          <button type="button" className="modal-close" onClick={onCancel}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Tab Switcher */}
          <div className="sample-tab-switcher">
            <button
              type="button"
              className={`sample-tab ${activeTab === 'url' ? 'active' : ''}`}
              onClick={() => setActiveTab('url')}
            >
              URL
            </button>
            <button
              type="button"
              className={`sample-tab ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              Upload
            </button>
            <button
              type="button"
              className={`sample-tab ${activeTab === 'plain-text' ? 'active' : ''}`}
              onClick={() => setActiveTab('plain-text')}
            >
              Plain Text
            </button>
          </div>

          {/* Tab Content */}
          <div className="sample-tab-content">
            {activeTab === 'url' && (
              <>
                <div className="modal-field">
                  <label>Sample Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masterclass"
                    className="modal-input"
                  />
                </div>
                <div className="modal-field">
                  <label>URL</label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="masterclass.com"
                    className="modal-input"
                  />
                </div>
              </>
            )}

            {activeTab === 'upload' && (
              <>
                <div className="modal-field">
                  <label>Sample Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter sample name..."
                    className="modal-input"
                  />
                </div>
                <div
                  className="upload-dropzone"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                  <Upload size={40} className="upload-icon" />
                  <p className="upload-text-primary">Select or drop a CSV to upload</p>
                  <p className="upload-text-secondary">accepted files are .csv</p>
                  {file && (
                    <p className="upload-file-name">{file.name}</p>
                  )}
                </div>
              </>
            )}

            {activeTab === 'plain-text' && (
              <>
                <div className="modal-field">
                  <label>Sample Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter sample name..."
                    className="modal-input"
                  />
                </div>
                <textarea
                  value={plainText}
                  onChange={(e) => setPlainText(e.target.value)}
                  placeholder="Add sample text here"
                  className="modal-textarea-large"
                  rows={10}
                />
              </>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <div className="modal-actions-spacer"></div>
          <button
            type="button"
            className="modal-button modal-button-primary"
            onClick={handleSave}
            disabled={
              (activeTab === 'url' && !url.trim()) ||
              (activeTab === 'plain-text' && !plainText.trim()) ||
              (activeTab === 'upload' && !file)
            }
          >
            <Plus size={12} />
            Add Sample
          </button>
        </div>
      </div>
    </div>
  );
};

