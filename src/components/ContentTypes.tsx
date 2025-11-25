import { useState } from 'react';
import type { ContentType } from '../types';
import { CardMenu } from './CardMenu';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { AddContentTypeModal } from './AddContentTypeModal';

interface Props {
  contentTypes: ContentType[];
  onChange: (contentTypes: ContentType[]) => void;
  onContentTypeClick: (index: number) => void;
  onDuplicateTagUpdate?: (originalName: string, newName: string) => void;
}

const getIconForContentType = (name: string): string => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('page')) return '📄';
  if (lowerName.includes('product')) return '📦';
  if (lowerName.includes('pillar')) return '📚';
  if (lowerName.includes('list')) return '📋';
  return '📝';
};

export const ContentTypes = ({ contentTypes, onChange, onContentTypeClick, onDuplicateTagUpdate }: Props) => {
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const addContentType = (name: string, sampleUrl: string) => {
    const newContentType: ContentType = {
      name,
      samples: sampleUrl ? [{
        title: 'Sample',
        body: sampleUrl,
        notes: '',
        tags: [name],
      }] : [],
      brandToneAndVoice: '',
      contentTypeRules: [],
    };
    const newContentTypes = [...contentTypes, newContentType];
    onChange(newContentTypes);
    setShowAddModal(false);
    // Navigate to the new content type detail page after state update
    setTimeout(() => {
      onContentTypeClick(newContentTypes.length - 1);
    }, 0);
  };


  const removeContentType = (index: number) => {
    onChange(contentTypes.filter((_, i) => i !== index));
    setDeleteIndex(null);
  };

  const duplicateContentType = (index: number) => {
    const contentTypeToDuplicate = contentTypes[index];
    const originalName = contentTypeToDuplicate.name || 'Content Type';
    const newName = `${originalName} (Copy)`;
    const duplicated: ContentType = {
      ...contentTypeToDuplicate,
      name: newName,
      samples: contentTypeToDuplicate.samples.map(sample => ({ ...sample })),
      contentTypeRules: contentTypeToDuplicate.contentTypeRules.map(rule => ({
        ...rule,
        tags: [...rule.tags],
      })),
    };
    const newContentTypes = [...contentTypes];
    newContentTypes.splice(index + 1, 0, duplicated);
    onChange(newContentTypes);
    
    // Update tags in rules
    if (onDuplicateTagUpdate && originalName) {
      onDuplicateTagUpdate(originalName, newName);
    }
  };

  return (
    <div className="content-types">
      <div className="section-header">
        <div>
          <h3>Content Types</h3>
          <p className="section-description">
            Provide key details for each content format you create.
          </p>
        </div>
        <button type="button" onClick={() => setShowAddModal(true)} className="btn-add-product">
          Add Content Type
        </button>
      </div>

      {contentTypes.length > 0 ? (
        <div className="content-type-cards">
          {contentTypes.map((contentType, index) => {
            const icon = getIconForContentType(contentType.name || '');
            
            return (
              <div 
                key={index} 
                className="content-type-card" 
                onClick={() => onContentTypeClick(index)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-icon-content">
                  <span className="card-icon-emoji">{icon}</span>
                </div>
                <div className="card-content">
                  <div className="card-title">
                    {contentType.name || 'Content type name'}
                  </div>
                </div>
                <CardMenu
                  onDuplicate={() => duplicateContentType(index)}
                  onDelete={() => setDeleteIndex(index)}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state-card" onClick={() => setShowAddModal(true)}>
          <div className="empty-state-icon">📝</div>
          <div className="empty-state-title">Create Content Type</div>
          <div className="empty-state-description">Add your first content type to get started</div>
        </div>
      )}
      {showAddModal && (
        <AddContentTypeModal
          onSave={addContentType}
          onCancel={() => setShowAddModal(false)}
        />
      )}
      {deleteIndex !== null && (
        <DeleteConfirmModal
          itemName={contentTypes[deleteIndex]?.name || 'Content Type'}
          onConfirm={() => removeContentType(deleteIndex)}
          onCancel={() => setDeleteIndex(null)}
        />
      )}
    </div>
  );
};
