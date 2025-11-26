import { useState } from 'react';
import type { BrandKitSchema, WritingRule } from '../types';
import { AddRuleModal } from './AddRuleModal';
import { RuleMenu } from './RuleMenu';

interface Props {
  data: BrandKitSchema;
  onChange: (data: BrandKitSchema) => void;
  onBack: () => void;
}

interface RuleWithLocation extends WritingRule {
  locations: Array<{
    type: 'global' | 'audience' | 'contentType' | 'region' | 'product';
    name: string;
    sourceIndex?: number;
  }>;
}

export const AllWritingRules = ({ data, onChange, onBack }: Props) => {
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [editingRule, setEditingRule] = useState<{ rule: WritingRule; location: RuleWithLocation['locations'][0] } | null>(null);
  const [deleteRule, setDeleteRule] = useState<{ rule: WritingRule; location: RuleWithLocation['locations'][0] } | null>(null);
  const [grouping] = useState<string>('No Grouping');

  // Collect all rules from all sources and group by rule content
  const collectAllRules = (): RuleWithLocation[] => {
    const ruleMap = new Map<string, RuleWithLocation>();

    // Global rules
    data.brandFoundations.writingRules.forEach((rule) => {
      const key = rule.id || `${rule.name}-${rule.description}`;
      if (!ruleMap.has(key)) {
        ruleMap.set(key, { ...rule, locations: [] });
      }
      ruleMap.get(key)!.locations.push({ type: 'global', name: 'Global' });
    });

    // Audience rules
    data.audiences.forEach((audience, audienceIndex) => {
      audience.writingRules.forEach((rule) => {
        const key = rule.id || `${rule.name}-${rule.description}`;
        if (!ruleMap.has(key)) {
          ruleMap.set(key, { ...rule, locations: [] });
        }
        ruleMap.get(key)!.locations.push({
          type: 'audience',
          name: audience.name || 'Audience',
          sourceIndex: audienceIndex,
        });
      });
    });

    // Content type rules
    data.contentTypes.forEach((contentType, contentTypeIndex) => {
      contentType.contentTypeRules.forEach((rule) => {
        const key = rule.id || `${rule.name}-${rule.description}`;
        if (!ruleMap.has(key)) {
          ruleMap.set(key, { ...rule, locations: [] });
        }
        ruleMap.get(key)!.locations.push({
          type: 'contentType',
          name: contentType.name || 'Content Type',
          sourceIndex: contentTypeIndex,
        });
      });
    });

    // Region rules
    data.regions.forEach((region, regionIndex) => {
      region.writingRules.forEach((rule) => {
        const key = rule.id || `${rule.name}-${rule.description}`;
        if (!ruleMap.has(key)) {
          ruleMap.set(key, { ...rule, locations: [] });
        }
        ruleMap.get(key)!.locations.push({
          type: 'region',
          name: region.name || 'Region',
          sourceIndex: regionIndex,
        });
      });
    });

    return Array.from(ruleMap.values());
  };

  const allRules = collectAllRules();

  const getLocationIcon = (type: string): string => {
    switch (type) {
      case 'global':
        return '🌍';
      case 'audience':
        return '👥';
      case 'contentType':
        return '📄';
      case 'region':
        return '🌐';
      case 'product':
        return '📦';
      default:
        return '•';
    }
  };

  const handleSaveRule = (rule: WritingRule) => {
    if (editingRule) {
      // Update the rule in its original location
      const location = editingRule.location;
      
      if (location.type === 'global') {
        const updated = [...data.brandFoundations.writingRules];
        const index = updated.findIndex(r => r.id === editingRule.rule.id);
        if (index !== -1) {
          updated[index] = rule;
          onChange({ ...data, brandFoundations: { ...data.brandFoundations, writingRules: updated } });
        }
      } else if (location.type === 'audience' && location.sourceIndex !== undefined) {
        const updated = [...data.audiences];
        const audience = updated[location.sourceIndex];
        const ruleIndex = audience.writingRules.findIndex(r => r.id === editingRule.rule.id);
        if (ruleIndex !== -1) {
          audience.writingRules[ruleIndex] = rule;
          onChange({ ...data, audiences: updated });
        }
      } else if (location.type === 'contentType' && location.sourceIndex !== undefined) {
        const updated = [...data.contentTypes];
        const contentType = updated[location.sourceIndex];
        const ruleIndex = contentType.contentTypeRules.findIndex(r => r.id === editingRule.rule.id);
        if (ruleIndex !== -1) {
          contentType.contentTypeRules[ruleIndex] = rule;
          onChange({ ...data, contentTypes: updated });
        }
      } else if (location.type === 'region' && location.sourceIndex !== undefined) {
        const updated = [...data.regions];
        const region = updated[location.sourceIndex];
        const ruleIndex = region.writingRules.findIndex(r => r.id === editingRule.rule.id);
        if (ruleIndex !== -1) {
          region.writingRules[ruleIndex] = rule;
          onChange({ ...data, regions: updated });
        }
      }
      
      setEditingRule(null);
    } else {
      // Add new global rule
      onChange({
        ...data,
        brandFoundations: {
          ...data.brandFoundations,
          writingRules: [...data.brandFoundations.writingRules, rule],
        },
      });
    }
    setShowAddRuleModal(false);
  };

  const handleDeleteRule = () => {
    if (!deleteRule) return;
    
    const location = deleteRule.location;
    
    if (location.type === 'global') {
      const updated = data.brandFoundations.writingRules.filter(r => r.id !== deleteRule.rule.id);
      onChange({ ...data, brandFoundations: { ...data.brandFoundations, writingRules: updated } });
    } else if (location.type === 'audience' && location.sourceIndex !== undefined) {
      const updated = [...data.audiences];
      updated[location.sourceIndex].writingRules = updated[location.sourceIndex].writingRules.filter(r => r.id !== deleteRule.rule.id);
      onChange({ ...data, audiences: updated });
    } else if (location.type === 'contentType' && location.sourceIndex !== undefined) {
      const updated = [...data.contentTypes];
      updated[location.sourceIndex].contentTypeRules = updated[location.sourceIndex].contentTypeRules.filter(r => r.id !== deleteRule.rule.id);
      onChange({ ...data, contentTypes: updated });
    } else if (location.type === 'region' && location.sourceIndex !== undefined) {
      const updated = [...data.regions];
      updated[location.sourceIndex].writingRules = updated[location.sourceIndex].writingRules.filter(r => r.id !== deleteRule.rule.id);
      onChange({ ...data, regions: updated });
    }
    
    setDeleteRule(null);
  };

  return (
    <div className="all-writing-rules">
      <div className="all-writing-rules-header">
        <div className="breadcrumb">
          <span className="breadcrumb-link">Brand Kit</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Writing Rules</span>
        </div>
        <div className="all-writing-rules-title-row">
          <button type="button" onClick={onBack} className="btn-back">
            ←
          </button>
          <div>
            <h1>All Writing Rules</h1>
            <p className="all-writing-rules-subtitle">
              These are all rules being applied across your brand context.
            </p>
          </div>
        </div>
        <div className="all-writing-rules-actions">
          <div className="date-range-selector">
            <span>Date Sep 17 - Sep 23</span>
            <span className="dropdown-arrow">▼</span>
          </div>
          <button type="button" className="btn-filters">
            Filters
          </button>
        </div>
      </div>

      <div className="all-writing-rules-content">
        <div className="all-writing-rules-toolbar">
          <div className="grouping-dropdown">
            <button type="button" className="grouping-button">
              {grouping} <span className="dropdown-arrow">▼</span>
            </button>
          </div>
          <button type="button" onClick={() => setShowAddRuleModal(true)} className="btn-add-rule">
            + Add Rule
          </button>
        </div>

        {allRules.length > 0 ? (
          <div className="all-writing-rules-table">
            <div className="all-writing-rules-table-header">
              <div className="all-rules-col-checkbox"></div>
              <div className="all-rules-col-rule">Rule</div>
              <div className="all-rules-col-location">Location Used</div>
              <div className="all-rules-col-actions"></div>
            </div>
            <div className="all-writing-rules-table-body">
              {allRules.map((rule, index) => (
                <div key={rule.id || index} className="all-writing-rules-table-row">
                  <div className="all-rules-col-checkbox">
                    <input type="checkbox" />
                  </div>
                  <div className="all-rules-col-rule">
                    {rule.description || rule.name}
                  </div>
                  <div className="all-rules-col-location">
                    <div className="location-tags">
                      {rule.locations.map((location, locIndex) => (
                        <span key={locIndex} className="location-tag">
                          {getLocationIcon(location.type)}
                          <span>{location.name}</span>
                          <span className="location-dropdown-arrow">▼</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="all-rules-col-actions">
                    <RuleMenu
                      onEdit={() => {
                        // Edit the first location's rule
                        setEditingRule({ rule, location: rule.locations[0] });
                        setShowAddRuleModal(true);
                      }}
                      onDelete={() => {
                        // Delete from the first location
                        setDeleteRule({ rule, location: rule.locations[0] });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <p>No writing rules yet. Click "+ Add Rule" to get started.</p>
          </div>
        )}
      </div>

      {showAddRuleModal && (
        <AddRuleModal
          audiences={data.audiences}
          contentTypes={data.contentTypes}
          regions={data.regions}
          initialRule={editingRule?.rule}
          onSave={handleSaveRule}
          onCancel={() => {
            setShowAddRuleModal(false);
            setEditingRule(null);
          }}
        />
      )}

      {deleteRule && (
        <div className="modal-overlay" onClick={() => setDeleteRule(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Delete Rule?</h3>
            </div>
            <div className="modal-body">
              <p className="modal-message">
                Are you sure you want to delete this rule? This action cannot be undone.
              </p>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="modal-button modal-button-secondary"
                onClick={() => setDeleteRule(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="modal-button modal-button-primary"
                onClick={handleDeleteRule}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

