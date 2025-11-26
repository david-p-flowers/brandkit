import { useState, useEffect, useRef } from 'react';
import type { ContentType, WritingRule, Sample } from '../types';
import { AddSampleModal } from './AddSampleModal';
import { MarkdownEditor } from './MarkdownEditor';
import { IconColorPicker } from './IconColorPicker';
import { X, FileText } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface Props {
  contentType: ContentType;
  onChange: (contentType: ContentType) => void;
  onBack: () => void;
  globalWritingRules: WritingRule[];
  allContentTypes: ContentType[];
  onViewAllRules?: () => void;
}

export const ContentTypeDetail = ({ contentType, onChange, onBack, globalWritingRules, allContentTypes, onViewAllRules }: Props) => {
  const [showGlobalRules, setShowGlobalRules] = useState(false);
  const [showAddSampleModal, setShowAddSampleModal] = useState(false);
  const [showIconColorPicker, setShowIconColorPicker] = useState(false);
  const previousContentTypeNameRef = useRef<string>(contentType.name || '');

  const updateField = (field: keyof ContentType, value: any) => {
    const updated = { ...contentType, [field]: value };
    
    // If the content type name changed, update all content type-specific rule tags and sample tags
    if (field === 'name' && value !== previousContentTypeNameRef.current) {
      const oldName = previousContentTypeNameRef.current;
      const newName = value || 'Content Type';
      
      // Update tags in all writing rules that reference this content type
      updated.contentTypeRules = updated.contentTypeRules.map(rule => ({
        ...rule,
        tags: rule.tags.map(tag => tag === oldName ? newName : tag)
      }));
      
      // Update tags in all samples that reference this content type
      updated.samples = updated.samples.map(sample => ({
        ...sample,
        tags: sample.tags ? sample.tags.map(tag => tag === oldName ? newName : tag) : [newName]
      }));
      
      previousContentTypeNameRef.current = newName;
    }
    
    onChange(updated);
  };

  // Sync the ref when content type changes externally
  useEffect(() => {
    previousContentTypeNameRef.current = contentType.name || '';
  }, [contentType.name]);

  const addSample = (name: string, url: string, content: string, type: 'url' | 'upload' | 'plain-text') => {
    const newSample: Sample = {
      title: name || '',
      body: type === 'url' ? url : type === 'plain-text' ? content : url,
      notes: type === 'upload' ? content : '',
      tags: [contentType.name || 'Content Type'],
    };
    updateField('samples', [...contentType.samples, newSample]);
    setShowAddSampleModal(false);
  };

  const updateSample = (sampleIndex: number, sample: Sample) => {
    const updated = [...contentType.samples];
    updated[sampleIndex] = sample;
    updateField('samples', updated);
  };

  const removeSample = (sampleIndex: number) => {
    updateField('samples', contentType.samples.filter((_, i) => i !== sampleIndex));
  };

  const addWritingRule = () => {
    const newRule: WritingRule = {
      id: Date.now().toString(),
      name: '',
      description: '',
      tags: [contentType.name || 'Content Type'],
    };
    updateField('contentTypeRules', [...contentType.contentTypeRules, newRule]);
  };

  const updateWritingRule = (ruleIndex: number, rule: WritingRule) => {
    const updated = [...contentType.contentTypeRules];
    updated[ruleIndex] = rule;
    updateField('contentTypeRules', updated);
  };

  const removeWritingRule = (ruleIndex: number) => {
    updateField('contentTypeRules', contentType.contentTypeRules.filter((_, i) => i !== ruleIndex));
  };

  const defaultIcon = 'FileText';
  const defaultColor = '#00b285';
  
  const contentTypeIcon = contentType.icon || defaultIcon;
  const contentTypeColor = contentType.color || defaultColor;
  const iconColorBg = contentType.color 
    ? `rgba(${parseInt(contentType.color.slice(1, 3), 16)}, ${parseInt(contentType.color.slice(3, 5), 16)}, ${parseInt(contentType.color.slice(5, 7), 16)}, 0.1)`
    : 'rgba(0, 178, 133, 0.1)';
  
  const IconComponent = (LucideIcons as any)[contentTypeIcon] || LucideIcons.FileText;
  
  const handleIconChange = (icon: string) => {
    updateField('icon', icon);
  };

  const handleColorChange = (color: string) => {
    updateField('color', color);
  };

  // Combine content type rules with global rules if toggle is on
  const allRules = showGlobalRules 
    ? [...globalWritingRules.map(rule => ({ ...rule, tags: ['Global'] })), ...contentType.contentTypeRules]
    : contentType.contentTypeRules;

  return (
    <div className="content-type-detail">
      <div className="content-type-detail-header">
        <div className="breadcrumb">
          <span className="breadcrumb-link">Brand Kit</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Content Type</span>
        </div>
        <div className="content-type-detail-title-row">
          <button type="button" onClick={onBack} className="btn-back">
            ←
          </button>
          <button
            type="button"
            className="content-type-icon-large-button"
            onClick={() => setShowIconColorPicker(true)}
            style={{ backgroundColor: iconColorBg, color: contentTypeColor }}
          >
            <IconComponent size={24} />
          </button>
          <input
            type="text"
            value={contentType.name || ''}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Content type name"
            className="content-type-name-large"
          />
        </div>
      </div>

      <div className="content-type-detail-content">
        <div className="detail-section">
          <div className="detail-section-header">
            <div className="detail-section-header-row">
              <h3>Samples</h3>
              <button type="button" onClick={() => setShowAddSampleModal(true)} className="btn-add-sample">
                + Add Sample
              </button>
            </div>
            <p className="detail-section-description">
              Add example links for this format (tag by region if needed).
            </p>
          </div>
          {contentType.samples.length > 0 ? (
            <div className="samples-grid">
              {contentType.samples.map((sample, sampleIndex) => {
                const getSampleIcon = () => {
                  if (sample.notes && sample.notes.includes('upload')) {
                    return '📄'; // File icon for uploads
                  }
                  if (sample.body && sample.body.startsWith('http')) {
                    return '🔗'; // Link icon for URLs
                  }
                  return '📝'; // Text icon for plain text
                };

                const getSampleType = () => {
                  if (sample.notes && sample.notes.includes('upload')) return 'Upload';
                  if (sample.body && sample.body.startsWith('http')) return 'URL';
                  return 'Plain Text';
                };

                return (
                  <div key={sampleIndex} className="sample-card">
                    <div className="sample-card-icon">{getSampleIcon()}</div>
                    <div className="sample-card-content">
                      <input
                        type="text"
                        value={sample.title || ''}
                        onChange={(e) => updateSample(sampleIndex, { ...sample, title: e.target.value })}
                        placeholder="Sample name"
                        className="sample-card-name"
                      />
                      <input
                        type="text"
                        value={sample.body}
                        onChange={(e) => updateSample(sampleIndex, { ...sample, body: e.target.value })}
                        placeholder={getSampleType() === 'URL' ? 'https://example.com' : getSampleType() === 'Plain Text' ? 'Sample text...' : 'File name'}
                        className="sample-card-url"
                      />
                      <div className="sample-card-type">{getSampleType()}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSample(sampleIndex)}
                      className="sample-card-remove"
                      title="Remove sample"
                    >
                      <X size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <p>No samples yet. Click "+ Add Sample" to get started.</p>
            </div>
          )}
        </div>

        <div className="detail-section">
          <div className="detail-section-header">
            <h3>Template Outline</h3>
            <p className="detail-section-description">
              Add the ideal markdown structure for this content type.
            </p>
          </div>
          <MarkdownEditor
            value={contentType.brandToneAndVoice}
            onChange={(value) => updateField('brandToneAndVoice', value)}
            placeholder="Enter template outline..."
            rows={20}
          />
        </div>

        <div className="detail-section">
          <div className="detail-section-header">
            <div className="detail-section-header-row">
              <h3>Writing Rules for {contentType.name || 'Content Type'}</h3>
              <div className="detail-section-header-actions">
                <div className="toggle-container">
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={showGlobalRules}
                      onChange={(e) => setShowGlobalRules(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Show Global Rules</span>
                </div>
                <button type="button" onClick={addWritingRule} className="btn-add-rule">
                  + Add Rule
                </button>
              </div>
            </div>
            <p className="detail-section-description">
              List specific writing rules for this content type. These rules will help for the structure and content for all workflows creating or refreshing content in this format.
            </p>
          </div>
          {allRules.length > 0 ? (
            <>
              <div className="writing-rules-table">
                <div className="writing-rules-table-header">
                  <div className="rules-col-rule">Rule</div>
                  <div className="rules-col-tags">Tags</div>
                  <div className="rules-col-actions"></div>
                </div>
                {allRules.map((rule, ruleIndex) => {
                  const isGlobal = showGlobalRules && ruleIndex < globalWritingRules.length;
                  const actualRuleIndex = isGlobal ? -1 : ruleIndex - globalWritingRules.length;
                  
                  return (
                    <div key={rule.id || ruleIndex} className="writing-rules-table-row">
                      <div className="rules-col-rule">
                        <input
                          type="text"
                          value={rule.description || rule.name}
                          onChange={(e) => {
                            if (!isGlobal) {
                              updateWritingRule(actualRuleIndex, { ...rule, description: e.target.value });
                            }
                          }}
                          placeholder="Enter rule description..."
                          className="rule-input"
                          disabled={isGlobal}
                        />
                      </div>
                      <div className="rules-col-tags">
                        <div className="tag-list">
                          {rule.tags && rule.tags.map((tag, tagIndex) => {
                            // For content type-specific rules, always show the current content type name
                            const displayTag = isGlobal ? tag : (tag === previousContentTypeNameRef.current || tag === contentType.name ? (contentType.name || 'Content Type') : tag);
                            return (
                              <span key={tagIndex} className="tag-chip">
                                {displayTag}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      <div className="rules-col-actions">
                        {!isGlobal && (
                          <button
                            type="button"
                            onClick={() => removeWritingRule(actualRuleIndex)}
                            className="btn-remove-rule"
                            title="Remove rule"
                          >
                            ⋮
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="rules-table-footer">
                <button type="button" className="btn-view-all-rules" onClick={onViewAllRules}>
                  View all rules
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p>No writing rules yet. Click "+ Add Guideline" to get started.</p>
            </div>
          )}
        </div>
      </div>

      {showAddSampleModal && (
        <AddSampleModal
          contentTypeName={contentType.name || 'Content Type'}
          contentTypes={allContentTypes}
          onSave={addSample}
          onCancel={() => setShowAddSampleModal(false)}
        />
      )}

      {showIconColorPicker && (
        <IconColorPicker
          currentIcon={contentTypeIcon}
          currentColor={contentTypeColor}
          onIconChange={handleIconChange}
          onColorChange={handleColorChange}
          onClose={() => setShowIconColorPicker(false)}
        />
      )}
    </div>
  );
};

