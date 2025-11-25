import { useState, useEffect, useRef } from 'react';
import type { Audience, WritingRule } from '../types';
import { AddRuleModal } from './AddRuleModal';

interface Props {
  audience: Audience;
  index: number;
  onChange: (audience: Audience) => void;
  onBack: () => void;
  globalWritingRules: WritingRule[];
  allAudiences: Audience[];
  allContentTypes: any[];
  allRegions: any[];
  onUpdateGlobalRules?: (rules: WritingRule[]) => void;
}

export const AudienceDetail = ({ audience, index, onChange, onBack, globalWritingRules, allAudiences, allContentTypes, allRegions, onUpdateGlobalRules }: Props) => {
  const [showGlobalRules, setShowGlobalRules] = useState(false);
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const previousAudienceNameRef = useRef<string>(audience.name || '');

  const updateField = (field: keyof Audience, value: any) => {
    const updated = { ...audience, [field]: value };
    
    // If the audience name changed, update all audience-specific rule tags
    if (field === 'name' && value !== previousAudienceNameRef.current) {
      const oldName = previousAudienceNameRef.current;
      const newName = value || 'Audience';
      
      // Update tags in all writing rules that reference this audience
      updated.writingRules = updated.writingRules.map(rule => ({
        ...rule,
        tags: rule.tags.map(tag => tag === oldName ? newName : tag)
      }));
      
      previousAudienceNameRef.current = newName;
    }
    
    onChange(updated);
  };

  // Sync the ref when audience changes externally
  useEffect(() => {
    previousAudienceNameRef.current = audience.name || '';
  }, [audience.name]);

  const addWritingRule = () => {
    setShowAddRuleModal(true);
  };

  const handleSaveRule = (rule: WritingRule) => {
    // If it's a global rule, add it to global rules and ensure toggle is on
    if (rule.tags.includes('Global')) {
      if (onUpdateGlobalRules) {
        onUpdateGlobalRules([...globalWritingRules, rule]);
      }
      setShowGlobalRules(true);
    } else {
      // It's an audience-specific rule, add it to this audience's rules
      updateField('writingRules', [...audience.writingRules, rule]);
    }
    setShowAddRuleModal(false);
  };

  const updateWritingRule = (ruleIndex: number, rule: WritingRule) => {
    const updated = [...audience.writingRules];
    updated[ruleIndex] = rule;
    updateField('writingRules', updated);
  };

  const removeWritingRule = (ruleIndex: number) => {
    updateField('writingRules', audience.writingRules.filter((_, i) => i !== ruleIndex));
  };

  const getInitialLetter = (name: string): string => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const getIconColor = (index: number): { bg: string; text: string } => {
    const colors = [
      { bg: '#e5f7f3', text: '#00b285' }, // green
      { bg: 'rgba(198,0,233,0.1)', text: '#c600e9' }, // purple
      { bg: 'rgba(110,110,255,0.1)', text: '#6e6eff' }, // blue
      { bg: 'rgba(255,119,77,0.1)', text: '#ff774d' }, // orange
    ];
    return colors[index % colors.length];
  };

  const iconColor = getIconColor(index);
  const initial = getInitialLetter(audience.name || '?');

  // Combine audience rules with global rules if toggle is on
  const allRules = showGlobalRules 
    ? [...globalWritingRules.map(rule => ({ ...rule, tags: ['Global'] })), ...audience.writingRules]
    : audience.writingRules;

  return (
    <div className="audience-detail">
      <div className="audience-detail-header">
        <div className="breadcrumb">
          <span className="breadcrumb-link">Brand Kit</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Audience</span>
        </div>
        <div className="audience-detail-title-row">
          <button type="button" onClick={onBack} className="btn-back">
            ←
          </button>
          <div className="audience-icon-large" style={{ backgroundColor: iconColor.bg, color: iconColor.text }}>
            {initial}
          </div>
          <input
            type="text"
            value={audience.name || ''}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Audience name"
            className="audience-name-large"
          />
        </div>
      </div>

      <div className="audience-detail-content">
        <div className="detail-section">
          <div className="detail-section-header">
            <h3>Audience Description</h3>
            <p className="detail-section-description">
              Describe this audience you're writing for and their main characteristics.
            </p>
          </div>
          <textarea
            value={audience.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Enter audience description..."
            className="detail-textarea"
            rows={12}
          />
        </div>

        <div className="detail-section">
          <div className="detail-section-header">
            <div className="detail-section-header-row">
              <h3>Writing Rules</h3>
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
              List specific writing rules for this audience. Audience writing rules will override the global writing rules in the instance where the rules conflict.
            </p>
          </div>
          {allRules.length > 0 ? (
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
                          // For audience-specific rules, always show the current audience name
                          const displayTag = isGlobal ? tag : (tag === previousAudienceNameRef.current || tag === audience.name ? (audience.name || 'Audience') : tag);
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
          ) : (
            <div className="empty-state">
              <p>No writing rules yet. Click "+ Add Rule" to get started.</p>
            </div>
          )}
        </div>
      </div>

      {showAddRuleModal && (
        <AddRuleModal
          audiences={allAudiences}
          contentTypes={allContentTypes}
          regions={allRegions}
          context={audience.name ? { type: 'audience', name: audience.name } : undefined}
          onSave={handleSaveRule}
          onCancel={() => setShowAddRuleModal(false)}
        />
      )}
    </div>
  );
};

