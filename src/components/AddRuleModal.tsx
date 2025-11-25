import { useState, useEffect, useRef } from 'react';
import type { WritingRule, Audience, ContentType, Region } from '../types';
import { X } from 'lucide-react';

interface Props {
  audiences: Audience[];
  contentTypes: ContentType[];
  regions: Region[];
  initialRule?: WritingRule;
  context?: {
    type: 'audience' | 'contentType' | 'region';
    name: string;
  };
  onSave: (rule: WritingRule) => void;
  onCancel: () => void;
}

export const AddRuleModal = ({ audiences, contentTypes, regions, initialRule, context, onSave, onCancel }: Props) => {
  const [description, setDescription] = useState(initialRule?.description || initialRule?.name || '');
  
  // Determine initial state based on context or initial rule
  const getInitialIsGlobal = () => {
    if (initialRule) return initialRule.tags.includes('Global');
    // If in a context (audience/contentType/region), default to false (specific)
    return !context;
  };
  
  const getInitialSelectedAudiences = () => {
    if (initialRule) {
      return initialRule.tags.filter(tag => audiences.some(a => a.name === tag));
    }
    // If in audience context, default to current audience
    if (context?.type === 'audience' && context.name) {
      return [context.name];
    }
    return [];
  };
  
  const getInitialSelectedContentTypes = () => {
    if (initialRule) {
      return initialRule.tags.filter(tag => contentTypes.some(ct => ct.name === tag));
    }
    // If in content type context, default to current content type
    if (context?.type === 'contentType' && context.name) {
      return [context.name];
    }
    return [];
  };
  
  const getInitialSelectedRegions = () => {
    if (initialRule) {
      return initialRule.tags.filter(tag => regions.some(r => r.name === tag));
    }
    // If in region context, default to current region
    if (context?.type === 'region' && context.name) {
      return [context.name];
    }
    return [];
  };
  
  const [isGlobal, setIsGlobal] = useState(getInitialIsGlobal());
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>(getInitialSelectedAudiences());
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>(getInitialSelectedContentTypes());
  const [selectedRegions, setSelectedRegions] = useState<string[]>(getInitialSelectedRegions());
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
    if (!description.trim()) return;

    let tags: string[] = [];
    if (isGlobal) {
      tags = ['Global'];
    } else {
      // Ensure we don't include "Global" if specific tags are selected
      tags = [...selectedAudiences, ...selectedContentTypes, ...selectedRegions].filter(tag => tag !== 'Global');
    }

    const rule: WritingRule = {
      id: initialRule?.id || `rule-${Date.now()}`,
      name: description,
      description: description,
      tags: tags,
    };

    onSave(rule);
  };


  const handleGlobalToggle = (checked: boolean) => {
    setIsGlobal(checked);
    if (checked) {
      // Clear all other selections when Global is selected
      setSelectedAudiences([]);
      setSelectedContentTypes([]);
      setSelectedRegions([]);
    }
  };

  const handleSpecificToggle = () => {
    setIsGlobal(false);
  };

  const toggleAudience = (name: string) => {
    if (isGlobal) {
      setIsGlobal(false);
    }
    setSelectedAudiences(prev =>
      prev.includes(name)
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  };

  const toggleContentType = (name: string) => {
    if (isGlobal) {
      setIsGlobal(false);
    }
    setSelectedContentTypes(prev =>
      prev.includes(name)
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  };

  const toggleRegion = (name: string) => {
    if (isGlobal) {
      setIsGlobal(false);
    }
    setSelectedRegions(prev =>
      prev.includes(name)
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  };

  const availableAudiences = audiences.map(a => a.name || '').filter(Boolean);
  const availableContentTypes = contentTypes.map(ct => ct.name || '').filter(Boolean);
  const availableRegions = regions.map(r => r.name || '').filter(Boolean);

  const hasSpecificSelections = selectedAudiences.length > 0 || selectedContentTypes.length > 0 || selectedRegions.length > 0;

  return (
    <div className="modal-overlay">
      <div className="modal-content add-rule-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-left">
            <h3 className="modal-title">{initialRule ? 'Edit Writing Rule' : 'Add Writing Rule'}</h3>
          </div>
          <button type="button" className="modal-close" onClick={onCancel}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-field">
            <label>Rule Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter rule description..."
              rows={3}
              className="modal-textarea"
            />
          </div>

          <div className="modal-field">
            <label>Apply To</label>
            <div className="tag-selection-container">
              {/* Global Option */}
              <div className="tag-option-group">
                <label className="tag-option-label">
                  <input
                    type="radio"
                    name="tagType"
                    checked={isGlobal}
                    onChange={(e) => handleGlobalToggle(e.target.checked)}
                    className="tag-radio"
                  />
                  <span>Global</span>
                </label>
                <p className="tag-option-description">Apply to all content across your brand kit</p>
              </div>

              {/* Specific Tags Option */}
              <div className="tag-option-group">
                <label className="tag-option-label">
                  <input
                    type="radio"
                    name="tagType"
                    checked={!isGlobal}
                    onChange={handleSpecificToggle}
                    className="tag-radio"
                  />
                  <span>Specific Tags</span>
                </label>
                <p className="tag-option-description">Apply to specific audiences, content types, or regions</p>
              </div>

              {/* Specific Tag Selections */}
              {!isGlobal && (
                <div className="specific-tags-container">
                  {availableAudiences.length > 0 && (
                    <div className="tag-category">
                      <label className="tag-category-label">Audiences</label>
                      <div className="tag-checkboxes">
                        {availableAudiences.map(audience => (
                          <label key={audience} className="tag-checkbox-label">
                            <input
                              type="checkbox"
                              checked={selectedAudiences.includes(audience)}
                              onChange={() => toggleAudience(audience)}
                              className="tag-checkbox"
                            />
                            <span>{audience}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {availableContentTypes.length > 0 && (
                    <div className="tag-category">
                      <label className="tag-category-label">Content Types</label>
                      <div className="tag-checkboxes">
                        {availableContentTypes.map(contentType => (
                          <label key={contentType} className="tag-checkbox-label">
                            <input
                              type="checkbox"
                              checked={selectedContentTypes.includes(contentType)}
                              onChange={() => toggleContentType(contentType)}
                              className="tag-checkbox"
                            />
                            <span>{contentType}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {availableRegions.length > 0 && (
                    <div className="tag-category">
                      <label className="tag-category-label">Regions</label>
                      <div className="tag-checkboxes">
                        {availableRegions.map(region => (
                          <label key={region} className="tag-checkbox-label">
                            <input
                              type="checkbox"
                              checked={selectedRegions.includes(region)}
                              onChange={() => toggleRegion(region)}
                              className="tag-checkbox"
                            />
                            <span>{region}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {availableAudiences.length === 0 && availableContentTypes.length === 0 && availableRegions.length === 0 && (
                    <p className="no-tags-message">No audiences, content types, or regions available. Create some first to apply specific tags.</p>
                  )}
                </div>
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
            disabled={!description.trim() || (!isGlobal && !hasSpecificSelections)}
          >
            {initialRule ? 'Save Changes' : 'Add Rule'}
          </button>
        </div>
      </div>
    </div>
  );
};

