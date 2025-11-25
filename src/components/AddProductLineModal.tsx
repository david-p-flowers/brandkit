import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface Props {
  onSave: (name: string, details: string) => void;
  onCancel: () => void;
}

export const AddProductLineModal = ({ onSave, onCancel }: Props) => {
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
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
    onSave(name.trim(), details.trim());
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-left">
            <h3 className="modal-title">Add a Product Line</h3>
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
              placeholder="Enter product line name..."
              className="modal-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSave();
                }
              }}
            />
          </div>

          <div className="modal-field">
            <label>Details</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Enter product line details..."
              rows={4}
              className="modal-textarea"
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
            Add Product Line
          </button>
        </div>
      </div>
    </div>
  );
};

