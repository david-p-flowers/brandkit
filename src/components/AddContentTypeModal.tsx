import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface Props {
  onSave: (name: string, sampleUrl: string) => void;
  onCancel: () => void;
}

export const AddContentTypeModal = ({ onSave, onCancel }: Props) => {
  const [name, setName] = useState('');
  const [sampleUrl, setSampleUrl] = useState('');
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
    if (!name.trim()) return;
    onSave(name.trim(), sampleUrl.trim());
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-left">
            <h3 className="modal-title">Add a Content Type</h3>
          </div>
          <button type="button" className="modal-close" onClick={onCancel}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-field">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter content type name..."
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
              value={sampleUrl}
              onChange={(e) => setSampleUrl(e.target.value)}
              placeholder="Enter sample URL..."
              className="modal-input"
            />
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
            disabled={!name.trim()}
          >
            Add Content Type
          </button>
        </div>
      </div>
    </div>
  );
};

