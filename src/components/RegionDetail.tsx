import { useState, useEffect, useRef } from 'react';
import type { Region, WritingRule } from '../types';

interface Props {
  region: Region;
  onChange: (region: Region) => void;
  onBack: () => void;
  globalWritingRules: WritingRule[];
  onViewAllRules?: () => void;
}

export const RegionDetail = ({ region, onChange, onBack, globalWritingRules, onViewAllRules }: Props) => {
  const [showGlobalRules, setShowGlobalRules] = useState(false);
  const previousRegionNameRef = useRef<string>(region.name || '');

  const updateField = (field: keyof Region, value: any) => {
    const updated = { ...region, [field]: value };
    
    // If the region name changed, update all region-specific rule tags
    if (field === 'name' && value !== previousRegionNameRef.current) {
      const oldName = previousRegionNameRef.current;
      const newName = value || 'Region';
      
      // Update tags in all writing rules that reference this region
      updated.writingRules = updated.writingRules.map(rule => ({
        ...rule,
        tags: rule.tags.map(tag => tag === oldName ? newName : tag)
      }));
      
      previousRegionNameRef.current = newName;
    }
    
    onChange(updated);
  };

  // Sync the ref when region changes externally
  useEffect(() => {
    previousRegionNameRef.current = region.name || '';
  }, [region.name]);

  const addWritingRule = () => {
    const newRule: WritingRule = {
      id: Date.now().toString(),
      name: '',
      description: '',
      tags: [region.name || 'Region'],
    };
    updateField('writingRules', [...region.writingRules, newRule]);
  };

  const updateWritingRule = (ruleIndex: number, rule: WritingRule) => {
    const updated = [...region.writingRules];
    updated[ruleIndex] = rule;
    updateField('writingRules', updated);
  };

  const removeWritingRule = (ruleIndex: number) => {
    updateField('writingRules', region.writingRules.filter((_, i) => i !== ruleIndex));
  };

  const getFlagIcon = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('united states') || lowerName.includes('us') || lowerName.includes('usa')) return '🇺🇸';
    if (lowerName.includes('united kingdom') || lowerName.includes('uk')) return '🇬🇧';
    if (lowerName.includes('brazil')) return '🇧🇷';
    if (lowerName.includes('france')) return '🇫🇷';
    if (lowerName.includes('germany')) return '🇩🇪';
    if (lowerName.includes('spain')) return '🇪🇸';
    if (lowerName.includes('italy')) return '🇮🇹';
    if (lowerName.includes('japan')) return '🇯🇵';
    if (lowerName.includes('china')) return '🇨🇳';
    if (lowerName.includes('australia')) return '🇦🇺';
    if (lowerName.includes('canada')) return '🇨🇦';
    if (lowerName.includes('default')) return '🌍';
    return '🌐';
  };

  const flagIcon = getFlagIcon(region.name || '');

  // Combine region rules with global rules if toggle is on
  const allRules = showGlobalRules 
    ? [...globalWritingRules.map(rule => ({ ...rule, tags: ['Global'] })), ...region.writingRules]
    : region.writingRules;

  return (
    <div className="region-detail">
      <div className="region-detail-header">
        <div className="breadcrumb">
          <span className="breadcrumb-link">Brand Kit</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Regions</span>
        </div>
        <div className="region-detail-title-row">
          <button type="button" onClick={onBack} className="btn-back">
            ←
          </button>
          <div className="region-icon-large">
            {flagIcon}
          </div>
          <input
            type="text"
            value={region.name || ''}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Region name"
            className="region-name-large"
          />
        </div>
      </div>

      <div className="region-detail-content">
        <div className="detail-section">
          <div className="detail-section-header">
            <h3>Region Details</h3>
            <p className="detail-section-description">
              Describe this region and who you are writing for and their main characteristics.
            </p>
          </div>
          <textarea
            value={region.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Enter region description..."
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
              List specific writing rules for this region. Region writing rules will override the global writing rules in the instance where the rules conflict.
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
                            // For region-specific rules, always show the current region name
                            const displayTag = isGlobal ? tag : (tag === previousRegionNameRef.current || tag === region.name ? (region.name || 'Region') : tag);
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
              <p>No writing rules yet. Click "+ Add Rule" to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

