import { useState } from 'react';
import type { Audience } from '../types';
import { CardMenu } from './CardMenu';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { AddAudienceModal } from './AddAudienceModal';
import * as LucideIcons from 'lucide-react';

interface Props {
  audiences: Audience[];
  onChange: (audiences: Audience[]) => void;
  onAudienceClick: (index: number) => void;
  onDuplicateTagUpdate: (originalName: string, newName: string) => void;
}

const isEmoji = (str: string): boolean => {
  return /[\u{1F300}-\u{1F9FF}]/u.test(str);
};

const getAudienceIcon = (audience: Audience) => {
  const defaultIcon = 'Users';
  const audienceIcon = audience.icon || defaultIcon;
  
  if (isEmoji(audienceIcon)) {
    return { type: 'emoji' as const, value: audienceIcon };
  }
  
  const IconComponent = (LucideIcons as any)[audienceIcon] || LucideIcons.Users;
  return { type: 'icon' as const, value: IconComponent };
};

const getAudienceColor = (audience: Audience, index: number): { bg: string; text: string } => {
  if (audience.color) {
    const color = audience.color;
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
            const iconData = getAudienceIcon(audience);
            const iconColor = getAudienceColor(audience, index);
            
            return (
              <div 
                key={index} 
                className="audience-card" 
                onClick={() => onAudienceClick(index)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-icon" style={{ backgroundColor: iconColor.bg, color: iconColor.text }}>
                  {iconData.type === 'emoji' ? (
                    <span style={{ fontSize: '20px' }}>{iconData.value}</span>
                  ) : (
                    <iconData.value size={20} />
                  )}
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
