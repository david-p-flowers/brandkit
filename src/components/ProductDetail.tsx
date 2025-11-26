import { useState } from 'react';
import type { ProductLine, Competitor, Region } from '../types';
import { AddCompetitorModal } from './AddCompetitorModal';

interface Props {
  productLine: ProductLine;
  onChange: (productLine: ProductLine) => void;
  onBack: () => void;
  regions: Region[];
}

export const ProductDetail = ({ productLine, onChange, onBack, regions }: Props) => {
  const [showAddCompetitorModal, setShowAddCompetitorModal] = useState(false);

  const updateField = (field: keyof ProductLine, value: any) => {
    onChange({ ...productLine, [field]: value });
  };

  const addCompetitor = (name: string, domain: string, competitorRegions: string[]) => {
    const newCompetitor: Competitor = {
      name,
      domain,
      regions: competitorRegions,
    };
    updateField('competitors', [...productLine.competitors, newCompetitor]);
    setShowAddCompetitorModal(false);
  };

  const updateCompetitor = (compIndex: number, competitor: Competitor) => {
    const updated = [...productLine.competitors];
    updated[compIndex] = competitor;
    updateField('competitors', updated);
  };

  const removeCompetitor = (compIndex: number) => {
    updateField('competitors', productLine.competitors.filter((_, i) => i !== compIndex));
  };

  const addRegionToCompetitor = (compIndex: number, region: string) => {
    const competitor = productLine.competitors[compIndex];
    if (!competitor.regions.includes(region)) {
      updateCompetitor(compIndex, {
        ...competitor,
        regions: [...competitor.regions, region],
      });
    }
  };

  const removeRegionFromCompetitor = (compIndex: number, region: string) => {
    const competitor = productLine.competitors[compIndex];
    updateCompetitor(compIndex, {
      ...competitor,
      regions: competitor.regions.filter((r) => r !== region),
    });
  };

  const getInitialLetter = (name: string): string => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const getFaviconUrl = (domain: string): string => {
    if (!domain) return '';
    // Clean the domain (remove http://, https://, www.)
    const cleanDomain = domain
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0]; // Remove path if present
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(cleanDomain)}&sz=32`;
  };

  return (
    <div className="product-detail">
      <div className="product-detail-header">
        <div className="breadcrumb">
          <span className="breadcrumb-link">Brand Kit</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Product</span>
        </div>
        <div className="product-detail-title-row">
          <button type="button" onClick={onBack} className="btn-back">
            ←
          </button>
          <div className="product-icon-large">
            <div className="icon-placeholder-large">{getInitialLetter(productLine.name || '?')}</div>
          </div>
          <input
            type="text"
            value={productLine.name || ''}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Product name"
            className="product-name-large"
          />
        </div>
      </div>

      <div className="product-detail-content">
        <div className="detail-section">
          <div className="detail-section-header">
            <h3>Product Line Details</h3>
            <p className="detail-section-description">
              Explain what this product does in detail — its core functionality and primary use cases.
            </p>
          </div>
          <textarea
            value={productLine.productLineDetails}
            onChange={(e) => updateField('productLineDetails', e.target.value)}
            placeholder="Enter product details..."
            className="detail-textarea"
            rows={12}
          />
        </div>

        <div className="detail-section">
          <div className="detail-section-header">
            <h3>Key Differentiators & Positioning</h3>
            <p className="detail-section-description">
              Explain what makes this product different and how you want it to be perceived in the market.
            </p>
          </div>
          <textarea
            value={productLine.keyDifferentiatorsAndPositioning}
            onChange={(e) => updateField('keyDifferentiatorsAndPositioning', e.target.value)}
            placeholder="Enter key differentiators..."
            className="detail-textarea"
            rows={12}
          />
        </div>

        <div className="detail-section">
          <div className="detail-section-header">
            <h3>Ideal Customers</h3>
            <p className="detail-section-description">
              Describe your ideal customer profile and their key characteristics.
            </p>
          </div>
          <textarea
            value={productLine.idealCustomers}
            onChange={(e) => updateField('idealCustomers', e.target.value)}
            placeholder="Enter ideal customer information..."
            className="detail-textarea"
            rows={8}
          />
        </div>

        <div className="detail-section">
          <div className="detail-section-header">
            <div className="detail-section-header-row">
              <h3>Product Competitors</h3>
              <button type="button" onClick={() => setShowAddCompetitorModal(true)} className="btn-add-competitor">
                + Add Competitor
              </button>
            </div>
            <p className="detail-section-description">
              List the main competitors that compete with this specific product.
            </p>
          </div>
          {productLine.competitors.length > 0 ? (
            <div className="competitors-table">
              <div className="competitors-table-header">
                <div className="competitor-col-name">Competitor</div>
                <div className="competitor-col-domain">Domain</div>
                <div className="competitor-col-region">Region</div>
                <div className="competitor-col-actions"></div>
              </div>
              {productLine.competitors.map((competitor, compIndex) => (
                <div key={compIndex} className="competitors-table-row">
                  <div className="competitor-col-name">
                    <div className="competitor-name-with-favicon">
                      {competitor.domain && (
                        <img
                          src={getFaviconUrl(competitor.domain)}
                          alt={`${competitor.name} favicon`}
                          className="competitor-favicon"
                          onError={(e) => {
                            // Hide image if it fails to load
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                      <input
                        type="text"
                        value={competitor.name}
                        onChange={(e) => updateCompetitor(compIndex, { ...competitor, name: e.target.value })}
                        placeholder="Competitor name"
                        className="competitor-input"
                      />
                    </div>
                  </div>
                  <div className="competitor-col-domain">
                    <input
                      type="text"
                      value={competitor.domain}
                      onChange={(e) => updateCompetitor(compIndex, { ...competitor, domain: e.target.value })}
                      placeholder="domain.com"
                      className="competitor-input"
                    />
                  </div>
                  <div className="competitor-col-region">
                    <div className="region-tags">
                      {competitor.regions.map((region, regionIndex) => (
                        <span key={regionIndex} className="region-tag">
                          {region}
                          <button
                            type="button"
                            onClick={() => removeRegionFromCompetitor(compIndex, region)}
                            className="region-tag-remove"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        placeholder="Add region"
                        className="region-input"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                            addRegionToCompetitor(compIndex, e.currentTarget.value.trim());
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="competitor-col-actions">
                    <button
                      type="button"
                      onClick={() => removeCompetitor(compIndex)}
                      className="btn-remove-competitor"
                      title="Remove competitor"
                    >
                      ⋮
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No competitors yet. Click "Add Competitor" to get started.</p>
            </div>
          )}
        </div>
      </div>

      {showAddCompetitorModal && (
        <AddCompetitorModal
          regions={regions}
          onSave={addCompetitor}
          onCancel={() => setShowAddCompetitorModal(false)}
        />
      )}
    </div>
  );
};

