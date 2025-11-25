import type { WritingRule } from '../types';

interface Props {
  writingRules: WritingRule[];
  onChange: (writingRules: WritingRule[]) => void;
}

export const GlobalWritingRules = ({ writingRules, onChange }: Props) => {
  const addRule = () => {
    const newRule: WritingRule = {
      id: `rule-${Date.now()}`,
      name: '',
      description: '',
      tags: [],
    };
    onChange([...writingRules, newRule]);
  };

  const updateRule = (index: number, rule: WritingRule) => {
    const updated = [...writingRules];
    updated[index] = rule;
    onChange(updated);
  };

  const removeRule = (index: number) => {
    onChange(writingRules.filter((_, i) => i !== index));
  };

  return (
    <div className="section">
      <div className="field-header">
        <h2>Global Writing Rules</h2>
        <button type="button" onClick={addRule} className="btn-add">
          + Add Rule
        </button>
      </div>

      {writingRules.map((rule, index) => (
        <div key={rule.id} className="rule-item">
          <div className="rule-header">
            <input
              type="text"
              value={rule.name}
              onChange={(e) => updateRule(index, { ...rule, name: e.target.value })}
              placeholder="Rule name"
              className="rule-name"
            />
            <button type="button" onClick={() => removeRule(index)} className="btn-remove">
              Remove
            </button>
          </div>
          <textarea
            value={rule.description}
            onChange={(e) => updateRule(index, { ...rule, description: e.target.value })}
            placeholder="Detailed rule description"
            rows={2}
          />
          <input
            type="text"
            value={rule.tags.join(', ')}
            onChange={(e) => updateRule(index, { ...rule, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
            placeholder="Tags (comma-separated): 'global', audience name, region name, or content type name"
          />
        </div>
      ))}
    </div>
  );
};

