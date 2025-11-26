import { useState } from 'react';
import type { BrandFoundations as BrandFoundationsType, WritingRule, Audience, ContentType, Region } from '../types';
import { MarkdownEditor } from './MarkdownEditor';
import { AddRuleModal } from './AddRuleModal';
import { RuleMenu } from './RuleMenu';
import { X } from 'lucide-react';

interface Props {
  data: BrandFoundationsType;
  onChange: (data: BrandFoundationsType) => void;
  audiences: Audience[];
  contentTypes: ContentType[];
  regions: Region[];
  onViewAllRules?: () => void;
}

export const BrandFoundations = ({ data, onChange, audiences, contentTypes, regions, onViewAllRules }: Props) => {
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [editingRuleIndex, setEditingRuleIndex] = useState<number | null>(null);
  const [deleteRuleIndex, setDeleteRuleIndex] = useState<number | null>(null);

  // Only show global rules from brandFoundations
  const allRules = data.writingRules;

  const updateField = <K extends keyof BrandFoundationsType>(
    field: K,
    value: BrandFoundationsType[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  const addRule = () => {
    setShowAddRuleModal(true);
  };

  const handleSaveRule = (rule: WritingRule) => {
    if (editingRuleIndex !== null) {
      // Update existing rule
      const updated = [...data.writingRules];
      updated[editingRuleIndex] = rule;
      updateField('writingRules', updated);
      setEditingRuleIndex(null);
    } else {
      // Add new rule
      updateField('writingRules', [...data.writingRules, rule]);
    }
    setShowAddRuleModal(false);
  };

  const handleEditRule = (index: number) => {
    setEditingRuleIndex(index);
    setShowAddRuleModal(true);
  };

  const handleDeleteRule = (index: number) => {
    setDeleteRuleIndex(index);
  };

  const confirmDeleteRule = () => {
    if (deleteRuleIndex !== null) {
      removeRule(deleteRuleIndex);
      setDeleteRuleIndex(null);
    }
  };

  const updateRule = (index: number, rule: WritingRule) => {
    const updated = [...data.writingRules];
    updated[index] = rule;
    updateField('writingRules', updated);
  };

  const removeRule = (index: number) => {
    updateField('writingRules', data.writingRules.filter((_, i) => i !== index));
  };

  return (
    <div className="brand-foundations">
      {/* Brand Name and Domain */}
      <div className="field-group">
        <div className="field">
          <label>
            Brand Name
            <span className="info-icon" title="Add your brand name">ℹ️</span>
          </label>
          <input
            type="text"
            value={data.brandName}
            onChange={(e) => updateField('brandName', e.target.value)}
            placeholder="Add your brand name."
          />
        </div>

        <div className="field">
          <label>
            Brand Domain
            <span className="info-icon" title="URL of your brand website">ℹ️</span>
          </label>
          <input
            type="text"
            value={data.brandDomain}
            onChange={(e) => updateField('brandDomain', e.target.value)}
            placeholder="URL of your brand website."
          />
        </div>
      </div>

      {/* About Your Brand */}
      <div className="section-card">
        <div className="section-header">
          <div>
            <h3>About Your Brand</h3>
            <p className="section-description">
              Describe what defines your brand — who you are, who you serve, what you do and what makes you stand out.
            </p>
          </div>
        </div>
        <div className="rich-text-editor">
          <MarkdownEditor
            value={data.aboutYourBrand}
            onChange={(value) => updateField('aboutYourBrand', value)}
            placeholder=""
            rows={12}
          />
        </div>
      </div>

      {/* Brand Voice & Tone */}
      <div className="section-card">
        <div className="section-header">
          <div>
            <h3>Brand Voice & Tone</h3>
            <p className="section-description">
              Define the tone, voice and personality that represents your brand.
            </p>
          </div>
        </div>
        <div className="rich-text-editor">
          <MarkdownEditor
            value={data.brandToneAndVoice}
            onChange={(value) => updateField('brandToneAndVoice', value)}
            placeholder="Add your brand tone and voice"
            rows={12}
          />
        </div>
      </div>

      {/* All Writing Rules */}
      <div className="section-card">
        <div className="section-header">
          <div>
            <h3>Global Writing Rules</h3>
            <p className="section-description">
              These global rules apply to your entire brand kit across all products, content types, audiences, and regions. To add region or audience-specific rules, go to their respective pages.
            </p>
          </div>
          <button type="button" onClick={addRule} className="btn-add-rule">
            + Add Rule
          </button>
        </div>
        
        {allRules.length > 0 ? (
          <div className="rules-table-container">
            <div className="rules-table">
              <div className="rules-table-header">
                <div className="rules-col-rule">Rule</div>
                <div className="rules-col-tags">Tags</div>
                <div className="rules-col-actions"></div>
              </div>
              <div className="rules-table-body">
                {allRules.map((rule, index) => {
                  return (
                    <div key={`${rule.id}-${index}`} className="rules-table-row">
                      <div className="rules-col-rule">
                        <span className="rule-info-icon">ℹ️</span>
                        <input
                          type="text"
                          value={rule.description || rule.name}
                          onChange={(e) => {
                            updateRule(index, { ...rule, description: e.target.value, name: e.target.value });
                          }}
                          placeholder="Rule description"
                          className="rule-input"
                        />
                      </div>
                      <div className="rules-col-tags">
                        <div className="tags-container">
                          {rule.tags.map((tag, tagIndex) => {
                            // Normalize display: "global" -> "Global"
                            const displayTag = tag === 'global' ? 'Global' : tag;
                            return (
                              <span key={tagIndex} className="tag-chip" title={displayTag}>
                                {displayTag}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      <div className="rules-col-actions">
                        <RuleMenu
                          onEdit={() => handleEditRule(index)}
                          onDelete={() => handleDeleteRule(index)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="rules-table-footer">
              <button type="button" className="btn-view-all-rules" onClick={onViewAllRules}>
                View all rules
              </button>
            </div>
          </div>
        ) : (
          <div className="empty-state">No rules yet. Click "+ Add Rule" to get started.</div>
        )}
      </div>

      {showAddRuleModal && (
        <AddRuleModal
          audiences={audiences}
          contentTypes={contentTypes}
          regions={regions}
          initialRule={editingRuleIndex !== null ? data.writingRules[editingRuleIndex] : undefined}
          onSave={handleSaveRule}
          onCancel={() => {
            setShowAddRuleModal(false);
            setEditingRuleIndex(null);
          }}
        />
      )}

      {deleteRuleIndex !== null && (
        <div className="modal-overlay" onClick={() => setDeleteRuleIndex(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-left">
                <h3 className="modal-title">Delete Rule?</h3>
              </div>
              <button type="button" className="modal-close" onClick={() => setDeleteRuleIndex(null)}>
                <X size={16} />
              </button>
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
                onClick={() => setDeleteRuleIndex(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="modal-button modal-button-danger"
                onClick={confirmDeleteRule}
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
