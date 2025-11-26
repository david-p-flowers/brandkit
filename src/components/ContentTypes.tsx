import { useState } from 'react';
import type { ContentType } from '../types';
import { CardMenu } from './CardMenu';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { AddContentTypeModal } from './AddContentTypeModal';
import * as LucideIcons from 'lucide-react';

interface Props {
  contentTypes: ContentType[];
  onChange: (contentTypes: ContentType[]) => void;
  onContentTypeClick: (index: number) => void;
  onDuplicateTagUpdate?: (originalName: string, newName: string) => void;
}

const getContentTypeIcon = (contentType: ContentType) => {
  const defaultIcon = 'FileText';
  const contentTypeIcon = contentType.icon || defaultIcon;
  const IconComponent = (LucideIcons as any)[contentTypeIcon] || LucideIcons.FileText;
  return IconComponent;
};

const getContentTypeColor = (contentType: ContentType, index: number): { bg: string; text: string } => {
  if (contentType.color) {
    const color = contentType.color;
    // Handle different color formats
    let r, g, b;
    if (color.startsWith('#')) {
      r = parseInt(color.slice(1, 3), 16);
      g = parseInt(color.slice(3, 5), 16);
      b = parseInt(color.slice(5, 7), 16);
    } else if (color.startsWith('rgb')) {
      const matches = color.match(/\d+/g);
      if (matches && matches.length >= 3) {
        r = parseInt(matches[0]);
        g = parseInt(matches[1]);
        b = parseInt(matches[2]);
      } else {
        r = g = b = 0;
      }
    } else if (color.startsWith('hsl')) {
      // For HSL, we'll use a simpler approach - convert to a light background
      const bg = `${color}1A`; // Add opacity
      return { bg, text: color };
    } else {
      r = g = b = 0;
    }
    const bg = `rgba(${r}, ${g}, ${b}, 0.1)`;
    return { bg, text: color };
  }
  
  // Default colors if no color is set
  const colors = [
    { bg: 'rgba(0, 178, 133, 0.1)', text: '#00b285' }, // green
    { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6' }, // blue
    { bg: 'rgba(168, 85, 247, 0.1)', text: '#a855f7' }, // purple
    { bg: 'rgba(236, 72, 153, 0.1)', text: '#ec4899' }, // pink
    { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b' }, // amber
    { bg: 'rgba(14, 165, 233, 0.1)', text: '#0ea5e9' }, // sky
    { bg: 'rgba(128, 133, 147, 0.1)', text: '#808593' }, // gray
  ];
  return colors[index % colors.length];
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
            const IconComponent = getContentTypeIcon(contentType);
            const iconColor = getContentTypeColor(contentType, index);
            
            return (
              <div 
                key={index} 
                className="content-type-card" 
                onClick={() => onContentTypeClick(index)}
                style={{ cursor: 'pointer' }}
              >
                <div 
                  className="card-icon-content"
                  style={{ 
                    backgroundColor: iconColor.bg, 
                    color: iconColor.text 
                  }}
                >
                  <IconComponent size={20} />
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
