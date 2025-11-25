import { useState } from 'react';
import type { Audience } from '../types';
import { CardMenu } from './CardMenu';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { AddAudienceModal } from './AddAudienceModal';

interface Props {
  audiences: Audience[];
  onChange: (audiences: Audience[]) => void;
  onAudienceClick: (index: number) => void;
  onDuplicateTagUpdate: (originalName: string, newName: string) => void;
}

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

export const Audiences = ({ audiences, onChange, onAudienceClick, onDuplicateTagUpdate }: Props) => {
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const addAudience = (name: string, description: string) => {
    const newAudience: Audience = {
      name,
      description,
      writingRules: [],
    };
    const newAudiences = [...audiences, newAudience];
    onChange(newAudiences);
    setShowAddModal(false);
    // Navigate to the new audience detail page after state update
    setTimeout(() => {
      onAudienceClick(newAudiences.length - 1);
    }, 0);
  };


  const removeAudience = (index: number) => {
    onChange(audiences.filter((_, i) => i !== index));
    setDeleteIndex(null);
  };

  const duplicateAudience = (index: number) => {
    const audienceToDuplicate = audiences[index];
    const originalName = audienceToDuplicate.name || 'Audience';
    const newName = `${originalName} (Copy)`;
    const duplicated: Audience = {
      ...audienceToDuplicate,
      name: newName,
      writingRules: audienceToDuplicate.writingRules.map(rule => ({
        ...rule,
        tags: [...rule.tags],
      })),
    };
    const newAudiences = [...audiences];
    newAudiences.splice(index + 1, 0, duplicated);
    onChange(newAudiences);
    
    // Update tags in rules
    if (onDuplicateTagUpdate && originalName) {
      onDuplicateTagUpdate(originalName, newName);
    }
  };

  return (
    <div className="audiences">
      <div className="section-header">
        <div>
          <h3>Audiences</h3>
          <p className="section-description">
            Provide key details about the audiences you're writing for.
          </p>
        </div>
        <button type="button" onClick={() => setShowAddModal(true)} className="btn-add-product">
          Add Audience
        </button>
      </div>

      {audiences.length > 0 ? (
        <div className="audience-cards">
          {audiences.map((audience, index) => {
            const iconColor = getIconColor(index);
            const initial = getInitialLetter(audience.name || '?');
            
            return (
              <div 
                key={index} 
                className="audience-card" 
                onClick={() => onAudienceClick(index)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-icon" style={{ backgroundColor: iconColor.bg, color: iconColor.text }}>
                  {initial}
                </div>
                <div className="card-content">
                  <div className="card-title">
                    {audience.name || 'Audience name'}
                  </div>
                  <div className="card-description">
                    {audience.description || 'Add a description'}
                  </div>
                </div>
                <CardMenu
                  onDuplicate={() => duplicateAudience(index)}
                  onDelete={() => setDeleteIndex(index)}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="audience-cards">
          <div className="empty-state-card audience-card" onClick={() => setShowAddModal(true)}>
            <div className="card-icon" style={{ backgroundColor: 'rgba(9, 9, 11, 0.04)', color: 'var(--color-text-secondary)' }}>
              👥
            </div>
            <div className="card-content">
              <div className="card-title">Create Audience</div>
              <div className="card-description">Add your first audience to get started</div>
            </div>
          </div>
        </div>
      )}
      {showAddModal && (
        <AddAudienceModal
          onSave={addAudience}
          onCancel={() => setShowAddModal(false)}
        />
      )}
      {deleteIndex !== null && (
        <DeleteConfirmModal
          itemName={audiences[deleteIndex]?.name || 'Audience'}
          onConfirm={() => removeAudience(deleteIndex)}
          onCancel={() => setDeleteIndex(null)}
        />
      )}
    </div>
  );
};
