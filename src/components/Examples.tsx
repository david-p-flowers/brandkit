import type { Example } from '../types';

interface Props {
  examples: Example[];
  onChange: (examples: Example[]) => void;
}

export const Examples = ({ examples, onChange }: Props) => {
  const addExample = () => {
    onChange([
      ...examples,
      {
        title: '',
        body: '',
        notes: '',
      },
    ]);
  };

  const updateExample = (index: number, example: Example) => {
    const updated = [...examples];
    updated[index] = example;
    onChange(updated);
  };

  const removeExample = (index: number) => {
    onChange(examples.filter((_, i) => i !== index));
  };

  return (
    <div className="section">
      <div className="section-header">
        <div>
          <h3>Examples</h3>
        </div>
        <button type="button" onClick={addExample} className="btn-add-guideline">
          + Add Example
        </button>
      </div>

      {examples.map((example, index) => (
        <div key={index} className="item-card">
          <div className="item-header">
            <input
              type="text"
              value={example.title || ''}
              onChange={(e) => updateExample(index, { ...example, title: e.target.value })}
              placeholder="Example title (optional)"
              className="item-title"
            />
            <button type="button" onClick={() => removeExample(index)} className="btn-remove-small">
              ×
            </button>
          </div>

          <div className="field">
            <label>Body</label>
            <textarea
              value={example.body}
              onChange={(e) => updateExample(index, { ...example, body: e.target.value })}
              placeholder="The example content itself"
              rows={4}
            />
          </div>

          <div className="field">
            <label>Notes</label>
            <textarea
              value={example.notes || ''}
              onChange={(e) => updateExample(index, { ...example, notes: e.target.value })}
              placeholder="Explanation of what makes this example good (optional)"
              rows={3}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

