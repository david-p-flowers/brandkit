import { useState, useRef, useEffect } from 'react';
import type { Region } from '../types';
import { X } from 'lucide-react';

interface Props {
  regions: Region[];
  onSave: (name: string, domain: string, selectedRegions: string[]) => void;
  onCancel: () => void;
}

export const AddCompetitorModal = ({ regions, onSave, onCancel }: Props) => {
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [isAllRegions, setIsAllRegions] = useState(true);
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
    
    let finalRegions: string[] = [];
    if (isAllRegions) {
      // "All regions" means all available region names
      finalRegions = regions.map(r => r.name || '').filter(Boolean);
    } else {
      finalRegions = selectedRegions;
    }
    
    onSave(name.trim(), domain.trim(), finalRegions);
  };

  const toggleRegion = (regionName: string) => {
    setSelectedRegions(prev =>
      prev.includes(regionName)
        ? prev.filter(r => r !== regionName)
        : [...prev, regionName]
    );
  };

  const handleAllRegionsToggle = (checked: boolean) => {
    setIsAllRegions(checked);
    if (checked) {
      setSelectedRegions([]);
    }
  };

  const availableRegions = regions.map(r => r.name || '').filter(Boolean);

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-left">
            <h3 className="modal-title">Add a Competitor</h3>
          </div>
          <button type="button" className="modal-close" onClick={onCancel}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-field">
            <label>Competitor name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter competitor name..."
              className="modal-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSave();
                }
              }}
            />
          </div>

          <div className="modal-field">
            <label>Competitor URL</label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Enter competitor URL..."
              className="modal-input"
            />
          </div>

          <div className="modal-field">
            <label>Region</label>
            <div className="region-selection-container">
              <label className="region-option-label">
                <input
                  type="radio"
                  name="regionType"
                  checked={isAllRegions}
                  onChange={(e) => handleAllRegionsToggle(e.target.checked)}
                  className="region-radio"
                />
                <span>All regions</span>
              </label>
              
              {availableRegions.length > 0 && (
                <>
                  <label className="region-option-label">
                    <input
                      type="radio"
                      name="regionType"
                      checked={!isAllRegions}
                      onChange={(e) => handleAllRegionsToggle(!e.target.checked)}
                      className="region-radio"
                    />
                    <span>Specific regions</span>
                  </label>
                  
                  {!isAllRegions && (
                    <div className="region-checkboxes">
                      {availableRegions.map(regionName => (
                        <label key={regionName} className="region-checkbox-label">
                          <input
                            type="checkbox"
                            checked={selectedRegions.includes(regionName)}
                            onChange={() => toggleRegion(regionName)}
                            className="region-checkbox"
                          />
                          <span>{regionName}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </>
              )}
              
              {availableRegions.length === 0 && (
                <p className="no-regions-message">No regions available. Create regions first to assign specific regions.</p>
              )}
            </div>
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
            Add competitor
          </button>
        </div>
      </div>
    </div>
  );
};

