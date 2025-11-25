import { useState, useRef, useEffect } from 'react';
import type { ContentType } from '../types';
import { X } from 'lucide-react';

interface Props {
  contentTypeName: string;
  contentTypes: ContentType[];
  onSave: (name: string, url: string, tag: string) => void;
  onCancel: () => void;
}

export const AddSampleModal = ({ contentTypeName, contentTypes, onSave, onCancel }: Props) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [selectedTag, setSelectedTag] = useState(contentTypeName || 'Content Type');
  const modalRef = useRef<HTMLDivElement>(null);

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
    if (!url.trim()) return;
    onSave(name.trim(), url.trim(), selectedTag);
  };

  const availableContentTypes = contentTypes.map(ct => ct.name || '').filter(Boolean);
  const availableTags = availableContentTypes.length > 0 ? availableContentTypes : [contentTypeName || 'Content Type'];

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Add a Sample</h3>
          <button type="button" className="modal-close" onClick={onCancel}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-field">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter sample name..."
              className="modal-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSave();
                }
              }}
            />
          </div>

          <div className="modal-field">
            <label>Sample URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter sample URL..."
              className="modal-input"
            />
          </div>

          <div className="modal-field">
            <label>Select a tag</label>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="modal-select"
            >
              {availableTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="modal-button modal-button-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="modal-button modal-button-primary"
            onClick={handleSave}
            disabled={!url.trim()}
          >
            Add Sample
          </button>
        </div>
      </div>
    </div>
  );
};

