import { useState, useRef, useEffect } from 'react';
import type { BrandKitSchema, WritingRule } from '../types';
import { AddRuleModal } from './AddRuleModal';
import { RuleMenu } from './RuleMenu';
import * as LucideIcons from 'lucide-react';

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
  const [grouping, setGrouping] = useState<string>('No Grouping');
  const [showGroupingDropdown, setShowGroupingDropdown] = useState(false);
  const groupingDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (groupingDropdownRef.current && !groupingDropdownRef.current.contains(event.target as Node)) {
        setShowGroupingDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Group rules by tag if grouping is enabled
  const getGroupedRules = () => {
    if (grouping !== 'Group by Tag') {
      return { ungrouped: allRules };
    }

    const grouped: Record<string, RuleWithLocation[]> = {};
    
    allRules.forEach(rule => {
      if (rule.tags && rule.tags.length > 0) {
        rule.tags.forEach(tag => {
          if (!grouped[tag]) {
            grouped[tag] = [];
          }
          // Only add if not already in this group (avoid duplicates)
          if (!grouped[tag].some(r => r.id === rule.id)) {
            grouped[tag].push(rule);
          }
        });
      } else {
        // Rules without tags go to "Untagged" group
        if (!grouped['Untagged']) {
          grouped['Untagged'] = [];
        }
        if (!grouped['Untagged'].some(r => r.id === rule.id)) {
          grouped['Untagged'].push(rule);
        }
      }
    });

    return grouped;
  };

  const groupedRules = getGroupedRules();

  const getLocationIcon = (location: { type: string; name: string; sourceIndex?: number }): { icon: string; color?: string } => {
    if (location.type === 'global') {
      return { icon: '🌍' };
    }
    
    if (location.type === 'audience' && location.sourceIndex !== undefined) {
      const audience = data.audiences[location.sourceIndex];
      if (audience?.icon) {
        // Use Lucide icon if available
        return { icon: audience.icon, color: audience.color };
      }
      return { icon: '👥' };
    }
    
    if (location.type === 'contentType' && location.sourceIndex !== undefined) {
      const contentType = data.contentTypes[location.sourceIndex];
      if (contentType?.icon) {
        return { icon: contentType.icon, color: contentType.color };
      }
      return { icon: '📄' };
    }
    
    if (location.type === 'region' && location.sourceIndex !== undefined) {
      const region = data.regions[location.sourceIndex];
      if (region?.flag) {
        return { icon: region.flag, color: region.color };
      }
      return { icon: '🌐' };
    }
    
    return { icon: '•' };
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
          <div className="grouping-dropdown" ref={groupingDropdownRef}>
            <button 
              type="button" 
              className="grouping-button"
              onClick={() => setShowGroupingDropdown(!showGroupingDropdown)}
            >
              {grouping} <span className="dropdown-arrow">▼</span>
            </button>
            {showGroupingDropdown && (
              <div className="grouping-dropdown-menu">
                <button
                  type="button"
                  className={`grouping-dropdown-item ${grouping === 'No Grouping' ? 'active' : ''}`}
                  onClick={() => {
                    setGrouping('No Grouping');
                    setShowGroupingDropdown(false);
                  }}
                >
                  No Grouping
                </button>
                <button
                  type="button"
                  className={`grouping-dropdown-item ${grouping === 'Group by Tag' ? 'active' : ''}`}
                  onClick={() => {
                    setGrouping('Group by Tag');
                    setShowGroupingDropdown(false);
                  }}
                >
                  Group by Tag
                </button>
              </div>
            )}
          </div>
          <button type="button" onClick={() => setShowAddRuleModal(true)} className="btn-add-rule">
            + Add Rule
          </button>
        </div>

        {allRules.length > 0 ? (
          grouping === 'Group by Tag' ? (
            // Grouped view
            <div className="all-writing-rules-grouped">
              {Object.entries(groupedRules).map(([tag, rules]) => (
                <div key={tag} className="all-writing-rules-group">
                  <div className="all-writing-rules-group-header">
                    <h3 className="all-writing-rules-group-title">{tag}</h3>
                    <span className="all-writing-rules-group-count">{rules.length} {rules.length === 1 ? 'rule' : 'rules'}</span>
                  </div>
                  <div className="all-writing-rules-table">
                    <div className="all-writing-rules-table-header">
                      <div className="all-rules-col-checkbox"></div>
                      <div className="all-rules-col-rule">Rule</div>
                      <div className="all-rules-col-location">Tags</div>
                      <div className="all-rules-col-actions"></div>
                    </div>
                    <div className="all-writing-rules-table-body">
                      {rules.map((rule, index) => (
                        <div key={rule.id || index} className="all-writing-rules-table-row">
                          <div className="all-rules-col-checkbox">
                            <input type="checkbox" />
                          </div>
                          <div className="all-rules-col-rule">
                            {rule.description || rule.name}
                          </div>
                          <div className="all-rules-col-location">
                            <div className="location-tags">
                              {rule.locations.map((location, locIndex) => {
                                const locationData = getLocationIcon(location);
                                const IconComponent = location.type !== 'global' && location.type !== 'region' && locationData.icon && (LucideIcons as any)[locationData.icon] 
                                  ? (LucideIcons as any)[locationData.icon] 
                                  : null;
                                const bgColor = locationData.color ? `${locationData.color}1A` : undefined;
                                
                                return (
                                  <span 
                                    key={locIndex} 
                                    className="location-tag"
                                    style={{
                                      backgroundColor: bgColor,
                                      color: locationData.color,
                                    }}
                                  >
                                    {IconComponent ? (
                                      <IconComponent size={14} />
                                    ) : (
                                      <span>{locationData.icon}</span>
                                    )}
                                    <span>{location.name}</span>
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                          <div className="all-rules-col-actions">
                            <RuleMenu
                              onEdit={() => {
                                // Find the first location for editing
                                const firstLocation = rule.locations[0];
                                setEditingRule({ rule, location: firstLocation });
                              }}
                              onDelete={() => {
                                const firstLocation = rule.locations[0];
                                setDeleteRule({ rule, location: firstLocation });
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Ungrouped view
            <div className="all-writing-rules-table">
              <div className="all-writing-rules-table-header">
                <div className="all-rules-col-checkbox"></div>
                <div className="all-rules-col-rule">Rule</div>
                <div className="all-rules-col-location">Tags</div>
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
                      {rule.locations.map((location, locIndex) => {
                        const locationData = getLocationIcon(location);
                        const IconComponent = location.type !== 'global' && location.type !== 'region' && locationData.icon && (LucideIcons as any)[locationData.icon] 
                          ? (LucideIcons as any)[locationData.icon] 
                          : null;
                        const bgColor = locationData.color ? `${locationData.color}1A` : undefined; // 10% opacity
                        
                        return (
                          <span 
                            key={locIndex} 
                            className="location-tag"
                            style={{
                              backgroundColor: bgColor,
                              color: locationData.color,
                            }}
                          >
                            {IconComponent ? (
                              <IconComponent size={14} />
                            ) : (
                              <span className="location-tag-icon">{locationData.icon}</span>
                            )}
                            <span>{location.name}</span>
                            <span className="location-dropdown-arrow">▼</span>
                          </span>
                        );
                      })}
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
          )
        ) : null}
        {allRules.length === 0 && (
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

