import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export const MarkdownEditor = ({ value, onChange, placeholder, rows = 12 }: MarkdownEditorProps) => {
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className="markdown-editor">
      <div className="editor-toolbar">
        <button type="button" className="toolbar-btn">✨ Improve</button>
        <div className="toolbar-divider"></div>
        <button type="button" className="toolbar-btn">T+</button>
        <div className="toolbar-divider"></div>
        <button type="button" className="toolbar-btn"><strong>B</strong></button>
        <button type="button" className="toolbar-btn"><em>I</em></button>
        <button type="button" className="toolbar-btn">"</button>
        <div className="toolbar-divider"></div>
        <button type="button" className="toolbar-btn">A</button>
        <button type="button" className="toolbar-btn">🔗</button>
        <div className="toolbar-divider"></div>
        <button type="button" className="toolbar-btn">&lt;/&gt;</button>
        <button type="button" className="toolbar-btn">📷</button>
        <div className="toolbar-divider"></div>
        <button type="button" className="toolbar-btn">•</button>
        <button type="button" className="toolbar-btn">1.</button>
        <div className="toolbar-divider"></div>
        <button 
          type="button" 
          className={`toolbar-btn ${isPreview ? 'active' : ''}`}
          onClick={() => setIsPreview(!isPreview)}
          title={isPreview ? 'Edit' : 'Preview'}
        >
          👁️
        </button>
      </div>
      {isPreview ? (
        <div className="markdown-preview">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {value || placeholder || ''}
          </ReactMarkdown>
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="editor-content"
        />
      )}
    </div>
  );
};

