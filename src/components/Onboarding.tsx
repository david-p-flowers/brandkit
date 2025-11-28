import { useState } from 'react';
import type { BrandKitSchema, ProductLine, ContentType, Competitor } from '../types';
import { MarkdownEditor } from './MarkdownEditor';
import { FileText, X, ChevronRight, Plus } from 'lucide-react';
import { getEmptySchema } from '../utils/storage';

interface Props {
  onComplete: (data: BrandKitSchema) => void;
  onCancel?: () => void;
}

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const Onboarding = ({ onComplete, onCancel }: Props) => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [uploadedDocument, setUploadedDocument] = useState<File | null>(null);
  
  // Product data
  const [productName, setProductName] = useState('');
  const [productContextType, setProductContextType] = useState<'url' | 'upload' | 'text'>('url');
  const [productContextUrl, setProductContextUrl] = useState('');
  const [productContextText, setProductContextText] = useState('');
  const [productDetails, setProductDetails] = useState('');
  const [productDifferentiators, setProductDifferentiators] = useState('');
  const [productIdealCustomer, setProductIdealCustomer] = useState('');
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  
  // Content type data
  const [contentTypeName, setContentTypeName] = useState('');
  const [contentTypeSampleType, setContentTypeSampleType] = useState<'url' | 'upload' | 'text'>('url');
  const [contentTypeSampleUrl, setContentTypeSampleUrl] = useState('');
  const [contentTypeTemplate, setContentTypeTemplate] = useState('');
  const [contentTypeRules, setContentTypeRules] = useState<string[]>(['']);
  
  const totalSteps = 10;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((currentStep + 1) as Step);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handleComplete = () => {
    const schema = getEmptySchema();
    
    // Set up brand foundations with basic info
    schema.brandFoundations = {
      ...schema.brandFoundations,
      brandName: productName || 'Your Brand',
      aboutYourBrand: productDetails || '',
      brandToneAndVoice: productDifferentiators || '',
      brandStoryAndPurpose: productIdealCustomer || '',
      enableAudiences: false,
      enableRegions: false,
    };

    // Add product line
    if (productName) {
      const productLine: ProductLine = {
        name: productName,
        productLineDetails: productDetails,
        keyDifferentiatorsAndPositioning: productDifferentiators,
        idealCustomers: productIdealCustomer,
        competitors: competitors,
        icon: 'Package',
      };
      schema.productLines = [productLine];
    }

    // Add content type
    if (contentTypeName) {
      const contentType: ContentType = {
        name: contentTypeName,
        samples: contentTypeSampleUrl ? [{
          title: contentTypeName,
          body: contentTypeSampleUrl,
        }] : [],
        brandToneAndVoice: contentTypeTemplate,
        contentTypeRules: contentTypeRules.filter(r => r.trim()).map((rule, index) => ({
          id: `rule-${index}`,
          name: `Rule ${index + 1}`,
          description: rule,
          tags: [contentTypeName],
        })),
        icon: 'FileText',
      };
      schema.contentTypes = [contentType];
    }

    onComplete(schema);
  };

  const addCompetitor = () => {
    setCompetitors([...competitors, { name: '', domain: '', regions: [] }]);
  };

  const updateCompetitor = (index: number, field: 'name' | 'domain', value: string) => {
    const updated = [...competitors];
    updated[index] = { ...updated[index], [field]: value };
    setCompetitors(updated);
  };

  const removeCompetitor = (index: number) => {
    setCompetitors(competitors.filter((_, i) => i !== index));
  };

  const addRule = () => {
    setContentTypeRules([...contentTypeRules, '']);
  };

  const updateRule = (index: number, value: string) => {
    const updated = [...contentTypeRules];
    updated[index] = value;
    setContentTypeRules(updated);
  };

  const removeRule = (index: number) => {
    setContentTypeRules(contentTypeRules.filter((_, i) => i !== index));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true; // Optional step
      case 2:
        return productName.trim().length > 0;
      case 3:
      case 4:
      case 5:
        return true; // Review steps
      case 6:
        return true; // Competitors optional
      case 7:
        return contentTypeName.trim().length > 0;
      case 8:
        return true; // Template optional
      case 9:
        return true; // Rules optional
      case 10:
        return true; // Review step
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="onboarding-step">
            <div className="onboarding-header">
              <h2>Let's build a brand kit</h2>
              <p>Defining your brand's content strategy drastically improves the output of your workflows. Setup should take approximately 10 minutes.</p>
            </div>
            <div className="onboarding-content">
              <div className="onboarding-field">
                <label>
                  Do you already have an internal brand kit? <span className="optional">(Optional)</span>
                </label>
                <p className="field-hint">ex. Content guidelines document, content writing rules, or content strategy guide</p>
                <div 
                  className="file-upload-area"
                  onClick={() => document.getElementById('document-upload')?.click()}
                >
                  <FileText size={32} />
                  <p className="upload-text">Upload a document</p>
                  <p className="upload-hint">accepted files are .pdf, .doc, .docx, .csv</p>
                </div>
                <input
                  id="document-upload"
                  type="file"
                  accept=".pdf,.doc,.docx,.csv"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setUploadedDocument(file);
                  }}
                />
                {uploadedDocument && (
                  <div className="uploaded-file">
                    <FileText size={16} />
                    <span>{uploadedDocument.name}</span>
                    <button type="button" onClick={() => setUploadedDocument(null)}>
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="onboarding-step">
            <div className="onboarding-header">
              <h2>Add a product to your brand kit</h2>
              <p>Define your products and associated content for each.</p>
            </div>
            <div className="onboarding-content">
              <div className="onboarding-icon-circle">
                <span style={{ fontSize: '24px' }}>📢</span>
              </div>
              <div className="onboarding-field">
                <label>Product name</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Use the name of your product"
                />
              </div>
              <div className="onboarding-field">
                <label>Add a context for your product</label>
                <div className="switch-tabs">
                  <button
                    type="button"
                    className={productContextType === 'url' ? 'active' : ''}
                    onClick={() => setProductContextType('url')}
                  >
                    URL
                  </button>
                  <button
                    type="button"
                    className={productContextType === 'upload' ? 'active' : ''}
                    onClick={() => setProductContextType('upload')}
                  >
                    Upload
                  </button>
                  <button
                    type="button"
                    className={productContextType === 'text' ? 'active' : ''}
                    onClick={() => setProductContextType('text')}
                  >
                    Plain Text
                  </button>
                </div>
                {productContextType === 'url' && (
                  <input
                    type="url"
                    value={productContextUrl}
                    onChange={(e) => setProductContextUrl(e.target.value)}
                    placeholder="Add a url for your product"
                  />
                )}
                {productContextType === 'text' && (
                  <textarea
                    value={productContextText}
                    onChange={(e) => setProductContextText(e.target.value)}
                    placeholder="Add context for your product"
                    rows={4}
                  />
                )}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="onboarding-step">
            <div className="onboarding-header">
              <h2>Review your product's details</h2>
              <p>Explain what this product does in detail — its core functionality and primary use cases.</p>
            </div>
            <div className="onboarding-content-review">
              <div className="onboarding-field">
                <label>Product Line Details</label>
                <div className="review-box">
                  <MarkdownEditor
                    value={productDetails}
                    onChange={setProductDetails}
                    placeholder="Enter product details..."
                    rows={12}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="onboarding-step">
            <div className="onboarding-header">
              <h2>Review your product's key differentiators & positioning</h2>
              <p>Explain what makes this product different and how you want it to be perceived in the market.</p>
            </div>
            <div className="onboarding-content-review">
              <div className="onboarding-field">
                <label>Key Differentiators & Positioning</label>
                <div className="review-box">
                  <MarkdownEditor
                    value={productDifferentiators}
                    onChange={setProductDifferentiators}
                    placeholder="Enter key differentiators..."
                    rows={12}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="onboarding-step">
            <div className="onboarding-header">
              <h2>Review your product's ideal customer</h2>
              <p>Describe your ideal customer profile and their key characteristics.</p>
            </div>
            <div className="onboarding-content-review">
              <div className="onboarding-field">
                <label>Ideal Customer Description</label>
                <div className="review-box">
                  <MarkdownEditor
                    value={productIdealCustomer}
                    onChange={setProductIdealCustomer}
                    placeholder="Enter ideal customer description..."
                    rows={12}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="onboarding-step">
            <div className="onboarding-header">
              <h2>Review this product's competitors</h2>
              <p>We'll use this list to compare your brand's visibility against competitors across topics to identify gaps and opportunities. Review the initial list of competitors we've identified based on your brand and audience.</p>
            </div>
            <div className="onboarding-content">
              <div className="competitors-list">
                <div className="competitors-header">
                  <span>Competitors <span className="count">({competitors.length}/5)</span></span>
                  <span>Domain</span>
                  <span></span>
                </div>
                {competitors.map((competitor, index) => (
                  <div key={index} className="competitor-row">
                    <input
                      type="text"
                      value={competitor.name}
                      onChange={(e) => updateCompetitor(index, 'name', e.target.value)}
                      placeholder="Competitor name"
                    />
                    <input
                      type="text"
                      value={competitor.domain}
                      onChange={(e) => updateCompetitor(index, 'domain', e.target.value)}
                      placeholder="https://example.com"
                    />
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeCompetitor(index)}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <button type="button" className="add-competitor-btn" onClick={addCompetitor}>
                  <Plus size={12} />
                  Add Competitor
                </button>
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="onboarding-step">
            <div className="onboarding-header">
              <h2>Add a content type to your brand kit</h2>
              <p>Provide key details for each content format you create.</p>
            </div>
            <div className="onboarding-content">
              <div className="onboarding-icon-circle">
                <FileText size={24} />
              </div>
              <div className="onboarding-field">
                <label>Content type name</label>
                <input
                  type="text"
                  value={contentTypeName}
                  onChange={(e) => setContentTypeName(e.target.value)}
                  placeholder="Add the name of your content type"
                />
              </div>
              <div className="onboarding-field">
                <label>Add a content type sample</label>
                <div className="switch-tabs">
                  <button
                    type="button"
                    className={contentTypeSampleType === 'url' ? 'active' : ''}
                    onClick={() => setContentTypeSampleType('url')}
                  >
                    URL
                  </button>
                  <button
                    type="button"
                    className={contentTypeSampleType === 'upload' ? 'active' : ''}
                    onClick={() => setContentTypeSampleType('upload')}
                  >
                    Upload
                  </button>
                  <button
                    type="button"
                    className={contentTypeSampleType === 'text' ? 'active' : ''}
                    onClick={() => setContentTypeSampleType('text')}
                  >
                    Plain Text
                  </button>
                </div>
                {contentTypeSampleType === 'url' && (
                  <input
                    type="url"
                    value={contentTypeSampleUrl}
                    onChange={(e) => setContentTypeSampleUrl(e.target.value)}
                    placeholder="Add a url sample for your content type"
                  />
                )}
              </div>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="onboarding-step">
            <div className="onboarding-header">
              <h2>Add a template outline for this content type</h2>
              <p>Add the ideal markdown structure for this content type.</p>
            </div>
            <div className="onboarding-content-review">
              <div className="onboarding-field">
                <label>Content Type Template Outline</label>
                <div className="review-box">
                  <MarkdownEditor
                    value={contentTypeTemplate}
                    onChange={setContentTypeTemplate}
                    placeholder="Enter template outline..."
                    rows={16}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 9:
        return (
          <div className="onboarding-step">
            <div className="onboarding-header">
              <h2>Add writing rules for this content type</h2>
              <p>Define specific writing rules that apply to this content type.</p>
            </div>
            <div className="onboarding-content">
              <div className="rules-list">
                <div className="rules-header">
                  <span>Rule</span>
                  <span></span>
                </div>
                {contentTypeRules.map((rule, index) => (
                  <div key={index} className="rule-row">
                    <input
                      type="text"
                      value={rule}
                      onChange={(e) => updateRule(index, e.target.value)}
                      placeholder="Enter a writing rule"
                    />
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeRule(index)}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <button type="button" className="add-rule-btn" onClick={addRule}>
                  <Plus size={12} />
                  Add Rule
                </button>
              </div>
            </div>
          </div>
        );
      case 10:
        return (
          <div className="onboarding-step">
            <div className="onboarding-header">
              <h2>Review Your Brand Kit</h2>
              <p>Brand kits are living documents and should be maintained as your brand grows and evolves over time. Within brand kits you can add additional products, content types, or edit existing context.</p>
            </div>
            <div className="onboarding-content-review">
              <div className="advanced-settings-card">
                <div className="advanced-settings-header">
                  <h3>Advanced Settings</h3>
                  <p>These settings are not on by default but can be added later by visiting brand kits within settings.</p>
                </div>
                <div className="advanced-settings-content">
                  <div className="advanced-settings-item">
                    <h4>Want to add an audience?</h4>
                    <p>Audiences allow you to define specific personas to write for as well as rules to abide by when writing content for them.</p>
                    <button type="button" className="add-feature-btn">
                      <Plus size={10} />
                      Add Audience
                    </button>
                  </div>
                  <div className="advanced-settings-item">
                    <h4>Want to add a region?</h4>
                    <p>Regions allow you to define specific locals or countries to write for as well as rules to abide by when writing content for them.</p>
                    <button type="button" className="add-feature-btn">
                      <Plus size={10} />
                      Add Region
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`onboarding-container ${currentStep === 10 ? 'onboarding-step-10' : ''}`}>
      <div className="onboarding-left">
        <div className="onboarding-progress">
          <div className="onboarding-logo">airops</div>
          <div className="progress-dots">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i + 1}
                className={`progress-dot ${currentStep === i + 1 ? 'active' : ''} ${currentStep > i + 1 ? 'completed' : ''}`}
              />
            ))}
          </div>
        </div>
        {renderStep()}
        <div className="onboarding-actions">
          {currentStep > 1 && (
            <button type="button" className="btn-secondary" onClick={handleBack}>
              Back
            </button>
          )}
          <button
            type="button"
            className="btn-primary"
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {currentStep === totalSteps ? 'Finish Brand Kit' : 'Continue'}
            {currentStep < totalSteps && <ChevronRight size={14} />}
          </button>
        </div>
      </div>
      <div className="onboarding-right">
        {onCancel && (
          <button
            type="button"
            className="onboarding-close-btn"
            onClick={onCancel}
            aria-label="Close onboarding"
          >
            <X size={20} />
          </button>
        )}
        <div className="onboarding-decorative-bg">S</div>
        {currentStep === 10 && (
          <div className="brand-kit-preview-card">
            <div className="preview-brand-header">
              <div className="preview-brand-logo">
                {productName ? productName.charAt(0).toUpperCase() : 'B'}
              </div>
              <h2 className="preview-brand-name">{productName || 'Your Brand'}</h2>
              <p className="preview-brand-domain">{productContextUrl ? new URL(productContextUrl).hostname : 'yourbrand.com'}</p>
            </div>
            <div className="preview-section">
              <div className="preview-section-header">
                <span className="preview-number">01</span>
                <div>
                  <h3>About Your Brand</h3>
                  <p className="preview-label">Brand Foundations</p>
                </div>
              </div>
              <p className="preview-text">{productDetails || 'No details provided'}</p>
            </div>
            <div className="preview-section">
              <div className="preview-section-header">
                <span className="preview-number">02</span>
                <div>
                  <h3>Brand Voice<br/>& Tone</h3>
                  <p className="preview-label">Brand Foundations</p>
                </div>
              </div>
              <p className="preview-text">{productDifferentiators || 'No differentiators provided'}</p>
            </div>
            <div className="preview-section">
              <div className="preview-section-header">
                <span className="preview-number">03</span>
                <div>
                  <h3>Products</h3>
                  <p className="preview-label">Product Lines</p>
                </div>
              </div>
              {productName && (
                <div className="preview-product-card">
                  <div className="preview-product-icon">📢</div>
                  <p className="preview-product-name">{productName}</p>
                </div>
              )}
            </div>
            <div className="preview-section">
              <div className="preview-section-header">
                <span className="preview-number">04</span>
                <div>
                  <h3>Content Types</h3>
                  <p className="preview-label">Content Types</p>
                </div>
              </div>
              {contentTypeName && (
                <div className="preview-content-type-card">
                  <div className="preview-content-type-icon">
                    <FileText size={16} />
                  </div>
                  <p className="preview-content-type-name">{contentTypeName}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

