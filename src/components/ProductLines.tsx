import { useState } from 'react';
import type { ProductLine } from '../types';
import { CardMenu } from './CardMenu';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { AddProductLineModal } from './AddProductLineModal';

interface Props {
  productLines: ProductLine[];
  onChange: (productLines: ProductLine[]) => void;
  onProductClick: (index: number) => void;
  onDuplicateTagUpdate?: (originalName: string, newName: string) => void;
}

export const ProductLines = ({ productLines, onChange, onProductClick, onDuplicateTagUpdate }: Props) => {
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const addProductLine = (name: string, details: string) => {
    const newProductLine: ProductLine = {
      name,
      productLineDetails: details,
      keyDifferentiatorsAndPositioning: '',
      idealCustomers: '',
      competitors: [] as ProductLine['competitors'],
    };
    const newProductLines = [...productLines, newProductLine];
    onChange(newProductLines);
    setShowAddModal(false);
    // Navigate to the new product detail page after state update
    setTimeout(() => {
      onProductClick(newProductLines.length - 1);
    }, 0);
  };

  const updateProductLine = (index: number, productLine: ProductLine) => {
    const updated = [...productLines];
    updated[index] = productLine;
    onChange(updated);
  };

  const removeProductLine = (index: number) => {
    onChange(productLines.filter((_, i) => i !== index));
    setDeleteIndex(null);
  };

  const duplicateProductLine = (index: number) => {
    const productToDuplicate = productLines[index];
    const originalName = productToDuplicate.name || 'Product';
    const newName = `${originalName} (Copy)`;
    const duplicated: ProductLine = {
      ...productToDuplicate,
      name: newName,
      productLineDetails: productToDuplicate.productLineDetails,
      keyDifferentiatorsAndPositioning: productToDuplicate.keyDifferentiatorsAndPositioning,
      idealCustomers: productToDuplicate.idealCustomers,
      competitors: productToDuplicate.competitors.map(comp => ({
        name: comp.name,
        domain: comp.domain,
        regions: [...comp.regions],
      })),
    };
    const newProductLines = [...productLines];
    newProductLines.splice(index + 1, 0, duplicated);
    onChange(newProductLines);
    
    // Update tags in rules
    if (onDuplicateTagUpdate && originalName) {
      onDuplicateTagUpdate(originalName, newName);
    }
  };

  const getInitialLetter = (name: string): string => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const getIconColor = (index: number): { bg: string; text: string } => {
    const colors = [
      { bg: 'rgba(111, 77, 227, 0.1)', text: '#6f4de3' }, // purple
      { bg: 'rgba(14, 159, 72, 0.1)', text: '#0e9f48' }, // green
      { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6' }, // blue
      { bg: 'rgba(220, 38, 38, 0.1)', text: '#dc2626' }, // red
      { bg: 'rgba(81, 93, 246, 0.1)', text: '#515df6' }, // indigo
      { bg: 'rgba(255, 119, 77, 0.1)', text: '#ff774d' }, // orange
      { bg: 'rgba(128, 133, 147, 0.1)', text: '#808593' }, // gray
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="product-lines">
      <div className="section-header">
        <div>
          <h3>Products</h3>
          <p className="section-description">
            Provide key details about each product line.
          </p>
        </div>
        <button type="button" onClick={() => setShowAddModal(true)} className="btn-add-product">
          Add Product Line
        </button>
      </div>

      {productLines.length > 0 ? (
        <div className="product-cards">
          {productLines.map((productLine, index) => {
            const iconColor = getIconColor(index);
            const initial = getInitialLetter(productLine.name || '?');
            
            return (
              <div 
                key={index} 
                className="product-card" 
                onClick={() => onProductClick(index)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-icon" style={{ backgroundColor: iconColor.bg, color: iconColor.text }}>
                  {initial}
                </div>
                <div className="card-content">
                  <div className="card-title">
                    {productLine.name || 'Product name'}
                  </div>
                  <div className="card-description">
                    {productLine.productLineDetails || 'Add a description'}
                  </div>
                </div>
                <CardMenu
                  onDuplicate={() => duplicateProductLine(index)}
                  onDelete={() => setDeleteIndex(index)}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state-card" onClick={() => setShowAddModal(true)}>
          <div className="empty-state-icon">📦</div>
          <div className="empty-state-title">Create Product Line</div>
          <div className="empty-state-description">Add your first product line to get started</div>
        </div>
      )}
      {showAddModal && (
        <AddProductLineModal
          onSave={addProductLine}
          onCancel={() => setShowAddModal(false)}
        />
      )}
      {deleteIndex !== null && (
        <DeleteConfirmModal
          itemName={productLines[deleteIndex]?.name || 'Product'}
          onConfirm={() => removeProductLine(deleteIndex)}
          onCancel={() => setDeleteIndex(null)}
        />
      )}
    </div>
  );
};
