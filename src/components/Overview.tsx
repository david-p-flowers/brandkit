import { useState, useEffect, useRef } from 'react';
import type { BrandKitSchema } from '../types';
import { Package, FileText, Users, Globe, Sparkles, Pencil, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getOGImageUrl, getBrandHeaderImage } from '../utils/brandHeaderImage';

interface Props {
  data: BrandKitSchema;
  onChange: (data: BrandKitSchema) => void;
  onProductClick: (index: number) => void;
  onContentTypeClick: (index: number) => void;
  onAudienceClick: (index: number) => void;
  onRegionClick: (index: number) => void;
  onNavigateToTab?: (tab: string) => void;
  onViewAllRules?: () => void;
}

export const Overview = ({ data, onChange, onProductClick, onContentTypeClick, onAudienceClick, onRegionClick, onNavigateToTab, onViewAllRules }: Props) => {
  const [headerImageUrl, setHeaderImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine header image URL - prioritize custom uploaded image, then fetched image
  useEffect(() => {
    const determineHeaderImage = async () => {
      // First, check if there's a custom uploaded image
      if (data.brandFoundations?.brandHeaderImage) {
        setHeaderImageUrl(data.brandFoundations.brandHeaderImage);
        setImageError(false);
        return;
      }

      // If no custom image, try to fetch from domain
      if (!data.brandFoundations?.brandDomain) {
        setHeaderImageUrl(null);
        setImageError(false);
        return;
      }

      setImageError(false);
      
      // Try to get the image using the utility function
      try {
        const imageUrl = await getBrandHeaderImage(data.brandFoundations.brandDomain);
        if (imageUrl) {
          setHeaderImageUrl(imageUrl);
        } else {
          // Fallback to common OG image path
          const ogUrl = getOGImageUrl(data.brandFoundations.brandDomain);
          setHeaderImageUrl(ogUrl);
        }
      } catch (error) {
        console.log('Error fetching header image:', error);
        // Fallback to common OG image path
        const ogUrl = getOGImageUrl(data.brandFoundations.brandDomain);
        setHeaderImageUrl(ogUrl);
      }
    };

    determineHeaderImage();
  }, [data.brandFoundations?.brandDomain, data.brandFoundations?.brandHeaderImage]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Convert to base64 data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl && data.brandFoundations) {
        // Update the brand foundations with the new image
        onChange({
          ...data,
          brandFoundations: {
            ...data.brandFoundations,
            brandHeaderImage: dataUrl,
          },
        });
      }
    };
    reader.readAsDataURL(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    if (data.brandFoundations) {
      onChange({
        ...data,
        brandFoundations: {
          ...data.brandFoundations,
          brandHeaderImage: undefined,
        },
      });
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const isEmoji = (str: string): boolean => {
    return /[\u{1F300}-\u{1F9FF}]/u.test(str);
  };

  const getEntityIcon = (type: 'product' | 'contentType' | 'audience' | 'region', entity: any) => {
    if (type === 'product' && entity.icon) {
      if (isEmoji(entity.icon)) {
        return <span style={{ fontSize: '20px' }}>{entity.icon}</span>;
      }
      const IconComponent = (LucideIcons as any)[entity.icon];
      return IconComponent ? <IconComponent size={20} /> : <Package size={20} />;
    }
    if (type === 'contentType' && entity.icon) {
      if (isEmoji(entity.icon)) {
        return <span style={{ fontSize: '20px' }}>{entity.icon}</span>;
      }
      const IconComponent = (LucideIcons as any)[entity.icon];
      return IconComponent ? <IconComponent size={20} /> : <FileText size={20} />;
    }
    if (type === 'audience' && entity.icon) {
      if (isEmoji(entity.icon)) {
        return <span style={{ fontSize: '20px' }}>{entity.icon}</span>;
      }
      const IconComponent = (LucideIcons as any)[entity.icon];
      return IconComponent ? <IconComponent size={20} /> : <Users size={20} />;
    }
    if (type === 'region' && entity.flag) {
      return <span style={{ fontSize: '20px' }}>{entity.flag}</span>;
    }
    
    // Default icons
    switch (type) {
      case 'product': return <Package size={20} />;
      case 'contentType': return <FileText size={20} />;
      case 'audience': return <Users size={20} />;
      case 'region': return <Globe size={20} />;
      default: return null;
    }
  };

  const getEntityColor = (type: 'product' | 'contentType' | 'audience' | 'region', entity: any) => {
    if (entity.color) return entity.color;
    switch (type) {
      case 'product': return '#6e6eff';
      case 'contentType': return '#00b285';
      case 'audience': return '#fbbf24';
      case 'region': return '#ff774d';
      default: return '#808593';
    }
  };

  // Get featured rules (first 3 global rules)
  const featuredRules = (data?.brandFoundations?.writingRules || []).slice(0, 3);
  
  // Get brand colors
  const brandColors = data?.brandFoundations?.brandColors;
  const primaryColor = brandColors?.primary || '#09090b';
  const secondaryColor = brandColors?.secondary || '#676c79';
  const accentColor = brandColors?.accent || '#6e6eff';

  if (!data || !data.brandFoundations) {
    return (
      <div className="overview">
        <div className="overview-hero-split overview-section-00 has-default-background">
          <div className="overview-hero-default-background"></div>
          <div className="overview-hero-content overview-hero-content-fullwidth">
            <div className="overview-hero-center">
              <h1 className="overview-brand-name-large">
                <span className="overview-brand-word">Your</span>
                <span className="overview-brand-word">Brand</span>
              </h1>
              <p className="overview-brand-description">
                Welcome to your brand kit. This is where your brand story comes to life.
              </p>
              {onNavigateToTab && (
                <button
                  type="button"
                  className="btn-primary overview-create-brand-kit-button"
                  onClick={() => onNavigateToTab('brand-foundations')}
                >
                  Create brand kit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overview" style={{ '--brand-primary': primaryColor, '--brand-secondary': secondaryColor, '--brand-accent': accentColor } as React.CSSProperties}>
      {/* Hero Section - Full Width with Background Image or Default Gradient */}
      <div className={`overview-hero-split overview-section-00 ${headerImageUrl && !imageError ? 'has-background-image' : 'has-default-background'}`}>
        {headerImageUrl && !imageError ? (
          <>
            <div 
              className="overview-hero-background-image"
              onMouseEnter={() => setIsHoveringImage(true)}
              onMouseLeave={() => setIsHoveringImage(false)}
            >
              <img
                src={headerImageUrl}
                alt={`${data.brandFoundations?.brandName || 'Brand'} header`}
                className="overview-hero-image"
                onError={() => setImageError(true)}
              />
              {isHoveringImage && (
                <div className="overview-hero-image-overlay">
                  <button
                    type="button"
                    className="overview-hero-image-upload-btn"
                    onClick={handleImageClick}
                    title="Change cover"
                  >
                    Change cover
                  </button>
                  {data.brandFoundations?.brandHeaderImage && (
                    <button
                      type="button"
                      className="overview-hero-image-remove-btn"
                      onClick={handleRemoveImage}
                      title="Remove cover"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="overview-hero-gradient-overlay"></div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </>
        ) : (
          <div className="overview-hero-default-background"></div>
        )}
        <div className="overview-hero-content">
          <div className="overview-hero-left">
            <h1 className="overview-brand-name-large">
              {(data.brandFoundations?.brandIcon || data.brandFoundations?.brandDomain) && (
                <span className="overview-brand-icon">
                  {data.brandFoundations?.brandIcon && data.brandFoundations.brandIcon.startsWith('http') ? (
                    <img 
                      src={data.brandFoundations.brandIcon} 
                      alt={data.brandFoundations?.brandName || 'Brand'} 
                      className="overview-brand-icon-img"
                    />
                  ) : data.brandFoundations?.brandDomain ? (
                    <img 
                      src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(data.brandFoundations.brandDomain)}&sz=64`}
                      alt={data.brandFoundations?.brandName || 'Brand'}
                      className="overview-brand-icon-img"
                    />
                  ) : null}
                </span>
              )}
              {data.brandFoundations?.brandName ? (
                <>
                  {data.brandFoundations.brandName.split(' ').map((word, i) => (
                    <span key={i} className="overview-brand-word">{word}</span>
                  ))}
                </>
              ) : (
                <span className="overview-brand-word">Your</span>
              )}
              {!data.brandFoundations?.brandName && (
                <span className="overview-brand-word">Brand</span>
              )}
            </h1>
          </div>
          <div className="overview-hero-divider"></div>
          <div className="overview-hero-right">
            {data.brandFoundations?.brandDomain && (
              <p className="overview-brand-domain">{data.brandFoundations.brandDomain}</p>
            )}
            {data.brandFoundations?.aboutYourBrand ? (
              <p className="overview-brand-description">
                {data.brandFoundations.aboutYourBrand}
              </p>
            ) : (
              <>
                <p className="overview-brand-description">
                  Welcome to your brand kit. This is where your brand story comes to life.
                </p>
                {onNavigateToTab && (
                  <button
                    type="button"
                    className="btn-primary overview-create-brand-kit-button"
                    onClick={() => onNavigateToTab('brand-foundations')}
                  >
                    Create brand kit
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* About Your Brand */}
      {data.brandFoundations?.aboutYourBrand && (
        <div className="overview-section-split overview-section-01">
          <div className="overview-section-left">
            <div className="overview-section-number">01</div>
            <h2 className="overview-section-title-large">
              <span className="overview-title-line">About</span>
              <span className="overview-title-line">Your Brand</span>
            </h2>
            <div className="overview-section-label">Brand Foundations</div>
          </div>
          <div className="overview-section-divider"></div>
          <div className="overview-section-right">
            <div className="overview-content-block">
              <div className="overview-markdown-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => <p className="overview-content-text">{children}</p>,
                    h1: ({ children }) => <h1 className="overview-content-heading">{children}</h1>,
                    h2: ({ children }) => <h2 className="overview-content-heading">{children}</h2>,
                    h3: ({ children }) => <h3 className="overview-content-heading">{children}</h3>,
                    strong: ({ children }) => <strong className="overview-content-strong">{children}</strong>,
                    em: ({ children }) => <em className="overview-content-em">{children}</em>,
                    ul: ({ children }) => <ul className="overview-content-list">{children}</ul>,
                    ol: ({ children }) => <ol className="overview-content-list">{children}</ol>,
                    li: ({ children }) => <li className="overview-content-list-item">{children}</li>,
                  }}
                >
                  {data.brandFoundations?.aboutYourBrand}
                </ReactMarkdown>
              </div>
              <button
                type="button"
                className="overview-edit-button"
                onClick={() => {
                  if (onNavigateToTab) {
                    onNavigateToTab('brand-foundations');
                  }
                }}
              >
                <Pencil size={14} />
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Brand Voice & Tone */}
      {data.brandFoundations?.brandToneAndVoice && (
        <div className="overview-section-split overview-section-02">
          <div className="overview-section-left">
            <div className="overview-section-number">02</div>
            <h2 className="overview-section-title-large">
              <span className="overview-title-line">Brand Voice</span>
              <span className="overview-title-line">& Tone</span>
            </h2>
            <div className="overview-section-label">Brand Foundations</div>
          </div>
          <div className="overview-section-divider"></div>
          <div className="overview-section-right">
            <div className="overview-content-block">
              <div className="overview-markdown-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => <p className="overview-content-text">{children}</p>,
                    h1: ({ children }) => <h1 className="overview-content-heading">{children}</h1>,
                    h2: ({ children }) => <h2 className="overview-content-heading">{children}</h2>,
                    h3: ({ children }) => <h3 className="overview-content-heading">{children}</h3>,
                    strong: ({ children }) => <strong className="overview-content-strong">{children}</strong>,
                    em: ({ children }) => <em className="overview-content-em">{children}</em>,
                    ul: ({ children }) => <ul className="overview-content-list">{children}</ul>,
                    ol: ({ children }) => <ol className="overview-content-list">{children}</ol>,
                    li: ({ children }) => <li className="overview-content-list-item">{children}</li>,
                  }}
                >
                  {data.brandFoundations?.brandToneAndVoice}
                </ReactMarkdown>
              </div>
              <button
                type="button"
                className="overview-edit-button"
                onClick={() => {
                  if (onNavigateToTab) {
                    onNavigateToTab('brand-foundations');
                  }
                }}
              >
                <Pencil size={14} />
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Showcase */}
      {(data.productLines?.length || 0) > 0 && (
        <div className="overview-section-split overview-section-03">
          <div className="overview-section-left">
            <div className="overview-section-number">03</div>
            <h2 className="overview-section-title-large">Products</h2>
            <div className="overview-section-meta">
              <span className="overview-section-count-large">{data.productLines.length}</span>
              <div className="overview-section-label">Product Lines</div>
            </div>
          </div>
          <div className="overview-section-divider"></div>
          <div className="overview-section-right">
            <div className="overview-entities-grid-compact">
              {data.productLines.slice(0, 5).map((product, index) => {
                const color = getEntityColor('product', product);
                const bgColor = `${color}1A`;
                return (
                  <div
                    key={index}
                    className="overview-entity-card-compact"
                    onClick={() => onProductClick(index)}
                    style={{
                      '--entity-color': color,
                      '--entity-bg': bgColor,
                    } as React.CSSProperties}
                  >
                    <div className="overview-entity-icon-compact" style={{ backgroundColor: bgColor, color }}>
                      {getEntityIcon('product', product)}
                    </div>
                    <h3 className="overview-entity-name-compact">{product.name || 'Unnamed Product'}</h3>
                  </div>
                );
              })}
              {data.productLines.length > 5 && (
                <div
                  className="overview-entity-card-compact overview-view-all-card"
                  onClick={() => {
                    if (onNavigateToTab) {
                      onNavigateToTab('product-lines');
                    }
                  }}
                >
                  <div className="overview-view-all-content">
                    <span className="overview-view-all-text">View all products</span>
                    <span className="overview-view-all-arrow">→</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content Types & Audiences - Side by Side */}
      {((data.contentTypes?.length || 0) > 0 || (data.audiences?.length || 0) > 0) && (
        <div className="overview-section-split overview-section-04">
          {(data.contentTypes?.length || 0) > 0 && (
            <>
              <div className="overview-section-left">
                <div className="overview-section-number">04</div>
                <h2 className="overview-section-title-large">Content</h2>
                <h2 className="overview-section-title-large">Types</h2>
                <div className="overview-section-meta">
                  <span className="overview-section-count-large">{data.contentTypes.length}</span>
                  <div className="overview-section-label">Content Types</div>
                </div>
              </div>
              <div className="overview-section-divider"></div>
              <div className="overview-section-right">
                <div className="overview-entities-grid-compact">
                  {data.contentTypes.slice(0, 6).map((contentType, index) => {
                    const color = getEntityColor('contentType', contentType);
                    const bgColor = `${color}1A`;
                    return (
                      <div
                        key={index}
                        className="overview-entity-card-compact"
                        onClick={() => onContentTypeClick(index)}
                        style={{
                          '--entity-color': color,
                          '--entity-bg': bgColor,
                        } as React.CSSProperties}
                      >
                        <div className="overview-entity-icon-compact" style={{ backgroundColor: bgColor, color }}>
                          {getEntityIcon('contentType', contentType)}
                        </div>
                        <h3 className="overview-entity-name-compact">{contentType.name || 'Unnamed Content Type'}</h3>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Audiences - Full Width */}
      {(data.audiences?.length || 0) > 0 && (
        <div className="overview-section-split overview-section-05">
          <div className="overview-section-left">
            <div className="overview-section-number">05</div>
            <h2 className="overview-section-title-large">Audiences</h2>
            <div className="overview-section-meta">
              <span className="overview-section-count-large">{data.audiences.length}</span>
              <div className="overview-section-label">Audiences</div>
            </div>
          </div>
          <div className="overview-section-divider"></div>
          <div className="overview-section-right">
            <div className="overview-entities-grid-compact">
              {data.audiences.slice(0, 6).map((audience, index) => {
                const color = getEntityColor('audience', audience);
                const bgColor = `${color}1A`;
                return (
                  <div
                    key={index}
                    className="overview-entity-card-compact"
                    onClick={() => onAudienceClick(index)}
                    style={{
                      '--entity-color': color,
                      '--entity-bg': bgColor,
                    } as React.CSSProperties}
                  >
                    <div className="overview-entity-icon-compact" style={{ backgroundColor: bgColor, color }}>
                      {getEntityIcon('audience', audience)}
                    </div>
                    <h3 className="overview-entity-name-compact">{audience.name || 'Unnamed Audience'}</h3>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Regions - Full Width */}
      {(data.regions?.length || 0) > 0 && (
        <div className="overview-section-split overview-section-06">
          <div className="overview-section-left">
            <div className="overview-section-number">06</div>
            <h2 className="overview-section-title-large">Regions</h2>
            <div className="overview-section-meta">
              <span className="overview-section-count-large">{data.regions.length}</span>
              <div className="overview-section-label">Regions</div>
            </div>
          </div>
          <div className="overview-section-divider"></div>
          <div className="overview-section-right">
            <div className="overview-entities-grid-compact">
              {data.regions.slice(0, 6).map((region, index) => {
                const color = getEntityColor('region', region);
                const bgColor = `${color}1A`;
                return (
                  <div
                    key={index}
                    className="overview-entity-card-compact"
                    onClick={() => onRegionClick(index)}
                    style={{
                      '--entity-color': color,
                      '--entity-bg': bgColor,
                    } as React.CSSProperties}
                  >
                    <div className="overview-entity-icon-compact" style={{ backgroundColor: bgColor, color }}>
                      {getEntityIcon('region', region)}
                    </div>
                    <h3 className="overview-entity-name-compact">{region.name || 'Unnamed Region'}</h3>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Writing Rules Typography - Split Layout */}
      {featuredRules.length > 0 && (
        <div className="overview-section-split overview-section-07">
          <div className="overview-section-left">
            <div className="overview-section-number">07</div>
            <h2 className="overview-section-title-large">
              <span className="overview-title-line">Writing</span>
              <span className="overview-title-line">Rules</span>
            </h2>
            <div className="overview-section-label">Global Rules</div>
            <Sparkles size={32} className="overview-sparkle-icon-large" />
          </div>
          <div className="overview-section-divider"></div>
          <div className="overview-section-right">
            <div className="overview-rules-container">
              <div className="overview-rules-typography-large">
                {featuredRules.map((rule, index) => (
                  <div key={rule.id || index} className="overview-rule-item-large">
                    <div className="overview-rule-number-large">{String(index + 1).padStart(2, '0')}</div>
                    <div className="overview-rule-content-large">
                      <p className="overview-rule-text-large">{rule.description || rule.name}</p>
                      {rule.tags && rule.tags.length > 0 && (
                        <div className="overview-rule-tags-large">
                          {rule.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="overview-rule-tag-large">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {onViewAllRules && (
                <button
                  type="button"
                  className="overview-rules-view-all"
                  onClick={onViewAllRules}
                >
                  View all rules →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

