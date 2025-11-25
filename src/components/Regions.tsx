import { useState } from 'react';
import type { Region } from '../types';
import { CardMenu } from './CardMenu';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { AddRegionModal } from './AddRegionModal';

interface Props {
  regions: Region[];
  onChange: (regions: Region[]) => void;
  onRegionClick: (index: number) => void;
  onDuplicateTagUpdate?: (originalName: string, newName: string) => void;
}

const getFlagIcon = (name: string): string => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('united states') || lowerName.includes('us') || lowerName.includes('usa')) return '🇺🇸';
  if (lowerName.includes('brazil')) return '🇧🇷';
  if (lowerName.includes('france')) return '🇫🇷';
  if (lowerName.includes('default')) return '🌍';
  return '🌐';
};

export const Regions = ({ regions, onChange, onRegionClick, onDuplicateTagUpdate }: Props) => {
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const addRegion = (name: string, description: string) => {
    const newRegion: Region = {
      name,
      description,
      writingRules: [],
    };
    const newRegions = [...regions, newRegion];
    onChange(newRegions);
    setShowAddModal(false);
    // Navigate to the new region detail page after state update
    setTimeout(() => {
      onRegionClick(newRegions.length - 1);
    }, 0);
  };


  const removeRegion = (index: number) => {
    onChange(regions.filter((_, i) => i !== index));
    setDeleteIndex(null);
  };

  const duplicateRegion = (index: number) => {
    const regionToDuplicate = regions[index];
    const originalName = regionToDuplicate.name || 'Region';
    const newName = `${originalName} (Copy)`;
    const duplicated: Region = {
      ...regionToDuplicate,
      name: newName,
      writingRules: regionToDuplicate.writingRules.map(rule => ({
        ...rule,
        tags: [...rule.tags],
      })),
    };
    const newRegions = [...regions];
    newRegions.splice(index + 1, 0, duplicated);
    onChange(newRegions);
    
    // Update tags in rules
    if (onDuplicateTagUpdate && originalName) {
      onDuplicateTagUpdate(originalName, newName);
    }
  };

  return (
    <div className="regions">
      <div className="section-header">
        <div>
          <h3>Regions</h3>
          <p className="section-description">
            Provide key details for the regions that you are trying to reach.
          </p>
        </div>
        <button type="button" onClick={() => setShowAddModal(true)} className="btn-add-product">
          Add Region
        </button>
      </div>

      {regions.length > 0 ? (
        <div className="region-cards">
          {regions.map((region, index) => {
            const flagIcon = getFlagIcon(region.name || '');
            
            return (
              <div 
                key={index} 
                className="region-card" 
                onClick={() => onRegionClick(index)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-icon-content">
                  <span className="card-icon-emoji">{flagIcon}</span>
                </div>
                <div className="card-content">
                  <div className="card-title">
                    {region.name || 'Region name'}
                  </div>
                </div>
                <CardMenu
                  onDuplicate={() => duplicateRegion(index)}
                  onDelete={() => setDeleteIndex(index)}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state-card" onClick={() => setShowAddModal(true)}>
          <div className="empty-state-icon">🌍</div>
          <div className="empty-state-title">Create Region</div>
          <div className="empty-state-description">Add your first region to get started</div>
        </div>
      )}
      {showAddModal && (
        <AddRegionModal
          onSave={addRegion}
          onCancel={() => setShowAddModal(false)}
        />
      )}
      {deleteIndex !== null && (
        <DeleteConfirmModal
          itemName={regions[deleteIndex]?.name || 'Region'}
          onConfirm={() => removeRegion(deleteIndex)}
          onCancel={() => setDeleteIndex(null)}
        />
      )}
    </div>
  );
};
