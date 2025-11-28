import React, { useState, useEffect, useRef } from 'react';
import type { BrandKitSchema, ProductLine } from './types';
import { saveToLocalStorage, loadFromLocalStorage, getEmptySchema, clearLocalStorage } from './utils/storage';
import { getKlaviyoData } from './utils/klaviyoData';
import { getXeroData } from './utils/xeroData';
import { getRipplingData } from './utils/ripplingData';
import { Sidebar } from './components/Sidebar';
import { TabNavigation } from './components/TabNavigation';
import { Overview } from './components/Overview';
import { BrandFoundations } from './components/BrandFoundations';
import { ProductLines } from './components/ProductLines';
import { ProductDetail } from './components/ProductDetail';
import { ContentTypes } from './components/ContentTypes';
import { ContentTypeDetail } from './components/ContentTypeDetail';
import { Audiences } from './components/Audiences';
import { AudienceDetail } from './components/AudienceDetail';
import { Regions } from './components/Regions';
import { RegionDetail } from './components/RegionDetail';
import { AllWritingRules } from './components/AllWritingRules';
import { Settings } from './components/Settings';
import { Onboarding } from './components/Onboarding';
import { ChevronDown } from 'lucide-react';
import './App.css';

function App() {
  const [data, setData] = useState<BrandKitSchema>(getEmptySchema());
  const [activeTab, setActiveTab] = useState('overview');

  // If the current tab is hidden due to settings, switch to overview
  React.useEffect(() => {
    if (activeTab === 'regions' && !(data.brandFoundations.enableRegions ?? true)) {
      setActiveTab('overview');
    }
    if (activeTab === 'audiences' && !(data.brandFoundations.enableAudiences ?? true)) {
      setActiveTab('overview');
    }
  }, [data.brandFoundations.enableRegions, data.brandFoundations.enableAudiences, activeTab]);
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);
  const [selectedAudienceIndex, setSelectedAudienceIndex] = useState<number | null>(null);
  const [selectedContentTypeIndex, setSelectedContentTypeIndex] = useState<number | null>(null);
  const [selectedRegionIndex, setSelectedRegionIndex] = useState<number | null>(null);
  // Get initial version from URL params or default to 'Default'
  const getInitialVersion = (): string => {
    const params = new URLSearchParams(window.location.search);
    const versionParam = params.get('version');
    if (versionParam && ['Default', 'Klaviyo', 'Xero', 'Rippling'].includes(versionParam)) {
      return versionParam;
    }
    // Fallback to localStorage if no URL param
    const storedVersion = localStorage.getItem('brand-kit-version');
    return storedVersion || 'Default';
  };

  const [selectedVersion, setSelectedVersion] = useState<string>(getInitialVersion());
  const [showAllWritingRules, setShowAllWritingRules] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const isInitialMount = useRef(true);

  // Update document title based on selected version
  useEffect(() => {
    if (selectedVersion === 'Default') {
      document.title = 'Brand Kit';
    } else {
      document.title = `Brand Kit - ${selectedVersion}`;
    }
  }, [selectedVersion]);

  const handleClearStorage = () => {
    clearLocalStorage();
    setData(getEmptySchema());
    setSelectedProductIndex(null);
    setSelectedAudienceIndex(null);
    setSelectedContentTypeIndex(null);
    setSelectedRegionIndex(null);
    setActiveTab('overview');
    setSelectedVersion('Default');
    isInitialMount.current = true;
  };

  const handleVersionChange = (version: string) => {
    setSelectedVersion(version);
    
    // Update URL parameter
    const url = new URL(window.location.href);
    if (version === 'Default') {
      url.searchParams.delete('version');
    } else {
      url.searchParams.set('version', version);
    }
    window.history.pushState({ version }, '', url.toString());
    
    if (version === 'Klaviyo') {
      const klaviyoData = getKlaviyoData();
      setData(klaviyoData);
      // Save version preference but don't save the data (it's always loaded fresh)
      localStorage.setItem('brand-kit-version', version);
    } else if (version === 'Xero') {
      const xeroData = getXeroData();
      setData(xeroData);
      // Save version preference but don't save the data (it's always loaded fresh)
      localStorage.setItem('brand-kit-version', version);
    } else if (version === 'Rippling') {
      const ripplingData = getRipplingData();
      setData(ripplingData);
      // Save version preference but don't save the data (it's always loaded fresh)
      localStorage.setItem('brand-kit-version', version);
    } else {
      // Default version: load from localStorage (user's custom data)
      const loaded = loadFromLocalStorage();
      if (loaded) {
        setData(loaded);
      } else {
        setData(getEmptySchema());
      }
      localStorage.setItem('brand-kit-version', version);
    }
    // Reset detail views when switching versions
    setSelectedProductIndex(null);
    setSelectedAudienceIndex(null);
    setSelectedContentTypeIndex(null);
    setSelectedRegionIndex(null);
  };

  // Helper function to add duplicate tag to rules
  const addDuplicateTagToRules = (originalName: string, newName: string) => {
    if (!originalName) return;

    // Update global writing rules
    const updatedGlobalRules = data.brandFoundations.writingRules.map(rule => {
      if (rule.tags.includes(originalName)) {
        return {
          ...rule,
          tags: [...rule.tags, newName],
        };
      }
      return rule;
    });

    // Update audience rules
    const updatedAudiences = data.audiences.map(audience => ({
      ...audience,
      writingRules: audience.writingRules.map(rule => {
        if (rule.tags.includes(originalName)) {
          return {
            ...rule,
            tags: [...rule.tags, newName],
          };
        }
        return rule;
      }),
    }));

    // Update content type rules
    const updatedContentTypes = data.contentTypes.map(contentType => ({
      ...contentType,
      contentTypeRules: contentType.contentTypeRules.map(rule => {
        if (rule.tags.includes(originalName)) {
          return {
            ...rule,
            tags: [...rule.tags, newName],
          };
        }
        return rule;
      }),
    }));

    // Update region rules
    const updatedRegions = data.regions.map(region => ({
      ...region,
      writingRules: region.writingRules.map(rule => {
        if (rule.tags.includes(originalName)) {
          return {
            ...rule,
            tags: [...rule.tags, newName],
          };
        }
        return rule;
      }),
    }));

    setData({
      ...data,
      brandFoundations: {
        ...data.brandFoundations,
        writingRules: updatedGlobalRules,
      },
      audiences: updatedAudiences,
      contentTypes: updatedContentTypes,
      regions: updatedRegions,
    });
  };

  // Load data from URL parameter or localStorage on mount
  useEffect(() => {
    // Check URL parameter first
    const params = new URLSearchParams(window.location.search);
    const versionParam = params.get('version');
    let versionToLoad: string;
    
    if (versionParam && ['Default', 'Klaviyo', 'Xero', 'Rippling'].includes(versionParam)) {
      versionToLoad = versionParam;
    } else {
      // Fallback to localStorage if no URL param
      versionToLoad = localStorage.getItem('brand-kit-version') || 'Default';
    }
    
    setSelectedVersion(versionToLoad);
    
    if (versionToLoad === 'Klaviyo') {
      const klaviyoData = getKlaviyoData();
      setData(klaviyoData);
    } else if (versionToLoad === 'Xero') {
      const xeroData = getXeroData();
      setData(xeroData);
    } else if (versionToLoad === 'Rippling') {
      const ripplingData = getRipplingData();
      setData(ripplingData);
    } else {
      // Default version: load from localStorage (user's custom data)
      const loaded = loadFromLocalStorage();
      if (loaded) {
        setData(loaded);
      }
    }
    isInitialMount.current = false;
  }, []);

  // Listen for URL changes (back/forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const versionParam = params.get('version');
      let versionToLoad: string;
      
      if (versionParam && ['Default', 'Klaviyo', 'Xero', 'Rippling'].includes(versionParam)) {
        versionToLoad = versionParam;
      } else {
        versionToLoad = 'Default';
      }
      
      if (versionToLoad !== selectedVersion) {
        setSelectedVersion(versionToLoad);
        
        // Load the appropriate data
        if (versionToLoad === 'Klaviyo') {
          const klaviyoData = getKlaviyoData();
          setData(klaviyoData);
        } else if (versionToLoad === 'Xero') {
          const xeroData = getXeroData();
          setData(xeroData);
        } else if (versionToLoad === 'Rippling') {
          const ripplingData = getRipplingData();
          setData(ripplingData);
        } else {
          const loaded = loadFromLocalStorage();
          if (loaded) {
            setData(loaded);
          } else {
            setData(getEmptySchema());
          }
        }
        
        // Reset detail views
        setSelectedProductIndex(null);
        setSelectedAudienceIndex(null);
        setSelectedContentTypeIndex(null);
        setSelectedRegionIndex(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedVersion]);

  // Auto-save to localStorage whenever data changes (only for Default version)
  useEffect(() => {
    // Skip save on initial mount
    if (isInitialMount.current) {
      return;
    }

    // Only save to localStorage if we're on the Default version (user's custom data)
    // Xero and Klaviyo data should never be saved to localStorage
    if (selectedVersion !== 'Default') {
      return;
    }

    const timer = setTimeout(() => {
      saveToLocalStorage(data);
    }, 500); // Debounce saves
    
    return () => clearTimeout(timer);
  }, [data, selectedVersion]);

  // Version Switcher Component
  const VersionSwitcher = ({ selectedVersion, onVersionChange }: { selectedVersion: string; onVersionChange: (version: string) => void }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const versions = ['Default', 'Klaviyo', 'Xero', 'Rippling'];

    useEffect(() => {
      if (!isDropdownOpen) return;

      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsDropdownOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isDropdownOpen]);

    return (
      <div className="header-version-switcher" ref={dropdownRef}>
        <button 
          type="button"
          className="header-version-switcher-button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDropdownOpen(!isDropdownOpen);
          }}
        >
          <span>{selectedVersion}</span>
          <ChevronDown size={14} className={`header-version-switcher-arrow ${isDropdownOpen ? 'open' : ''}`} />
        </button>
        {isDropdownOpen && (
          <div 
            className="header-version-switcher-dropdown"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            {versions.map((version) => (
              <button
                key={version}
                type="button"
                className={`header-version-switcher-option ${version === selectedVersion ? 'active' : ''}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onVersionChange(version);
                  setIsDropdownOpen(false);
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                {version}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <Overview
            data={data}
            onChange={setData}
            onProductClick={(index) => {
              setSelectedProductIndex(index);
              setActiveTab('product-lines');
            }}
            onContentTypeClick={(index) => {
              setSelectedContentTypeIndex(index);
              setActiveTab('content-types');
            }}
            onAudienceClick={(index) => {
              setSelectedAudienceIndex(index);
              setActiveTab('audiences');
            }}
            onRegionClick={(index) => {
              setSelectedRegionIndex(index);
              setActiveTab('regions');
            }}
            onNavigateToTab={(tab) => {
              setActiveTab(tab);
            }}
            onViewAllRules={() => setShowAllWritingRules(true)}
            onStartOnboarding={() => setShowOnboarding(true)}
          />
        );
      case 'brand-foundations':
        return (
          <BrandFoundations
            data={data.brandFoundations}
            onChange={(brandFoundations) => setData({ ...data, brandFoundations })}
            audiences={data.audiences}
            contentTypes={data.contentTypes}
            regions={data.regions}
            onViewAllRules={() => setShowAllWritingRules(true)}
          />
        );
      case 'product-lines':
        return (
          <ProductLines
            productLines={data.productLines}
            onChange={(productLines) => setData({ ...data, productLines })}
            onProductClick={(index) => setSelectedProductIndex(index)}
            onDuplicateTagUpdate={addDuplicateTagToRules}
          />
        );
      case 'audiences':
        return (
          <Audiences
            audiences={data.audiences}
            onChange={(audiences) => setData({ ...data, audiences })}
            onAudienceClick={(index) => setSelectedAudienceIndex(index)}
            onDuplicateTagUpdate={addDuplicateTagToRules}
          />
        );
      case 'content-types':
        return (
          <ContentTypes
            contentTypes={data.contentTypes}
            onChange={(contentTypes) => setData({ ...data, contentTypes })}
            onContentTypeClick={(index) => setSelectedContentTypeIndex(index)}
            onDuplicateTagUpdate={addDuplicateTagToRules}
          />
        );
      case 'regions':
        return (
          <Regions
            regions={data.regions}
            onChange={(regions) => setData({ ...data, regions })}
            onRegionClick={(index) => setSelectedRegionIndex(index)}
            onDuplicateTagUpdate={addDuplicateTagToRules}
          />
        );
      default:
        return null;
    }
  };

  // If showing onboarding, show the onboarding flow
  if (showOnboarding) {
    return (
      <Onboarding
        onComplete={(onboardingData) => {
          // Save the onboarding data to the default version
          setData(onboardingData);
          setSelectedVersion('Default');
          // Save to localStorage
          saveToLocalStorage(onboardingData);
          // Close onboarding and show overview
          setShowOnboarding(false);
          setActiveTab('overview');
        }}
        onCancel={() => setShowOnboarding(false)}
      />
    );
  }

  // If showing settings, show the settings page
  if (showSettings) {
    return (
      <div className="app">
        <Sidebar 
          activeSection="settings" 
          onClearStorage={handleClearStorage}
          selectedVersion={selectedVersion}
          onVersionChange={handleVersionChange}
          onSettingsClick={() => setShowSettings(true)}
          onBrandKitClick={() => setShowSettings(false)}
        />
        <main className="main-content">
          <Settings 
            onBack={() => setShowSettings(false)}
            data={data}
            onChange={setData}
          />
        </main>
      </div>
    );
  }

  // If showing all writing rules, show the full-page view
  if (showAllWritingRules) {
    return (
      <div className="app">
        <Sidebar 
          activeSection="brand-kit" 
          onClearStorage={handleClearStorage}
          selectedVersion={selectedVersion}
          onVersionChange={handleVersionChange}
          onSettingsClick={() => setShowSettings(true)}
          onBrandKitClick={() => setShowSettings(false)}
        />
        <main className="main-content">
          <AllWritingRules
            data={data}
            onChange={setData}
            onBack={() => setShowAllWritingRules(false)}
          />
        </main>
      </div>
    );
  }

  // If a product is selected, show the full-page detail view
  if (selectedProductIndex !== null && activeTab === 'product-lines') {
    const handleProductChange = (updatedProduct: ProductLine) => {
      const updated = [...data.productLines];
      updated[selectedProductIndex] = updatedProduct;
      setData({ ...data, productLines: updated });
    };

    return (
      <div className="app">
        <Sidebar 
          activeSection="brand-kit" 
          onClearStorage={handleClearStorage}
          selectedVersion={selectedVersion}
          onVersionChange={handleVersionChange}
          onSettingsClick={() => setShowSettings(true)}
          onBrandKitClick={() => setShowSettings(false)}
        />
        <main className="main-content">
          <ProductDetail
            productLine={data.productLines[selectedProductIndex]}
            onChange={handleProductChange}
            onBack={() => setSelectedProductIndex(null)}
            regions={data.regions}
            enableRegions={data.brandFoundations.enableRegions ?? true}
            onNavigateToSettings={() => setShowSettings(true)}
          />
        </main>
      </div>
    );
  }

  // If an audience is selected, show the full-page detail view
  if (selectedAudienceIndex !== null && activeTab === 'audiences') {
    const handleAudienceChange = (updatedAudience: typeof data.audiences[0]) => {
      const updated = [...data.audiences];
      updated[selectedAudienceIndex] = updatedAudience;
      setData({ ...data, audiences: updated });
    };

    return (
      <div className="app">
        <Sidebar 
          activeSection="brand-kit" 
          onClearStorage={handleClearStorage}
          selectedVersion={selectedVersion}
          onVersionChange={handleVersionChange}
          onSettingsClick={() => setShowSettings(true)}
          onBrandKitClick={() => setShowSettings(false)}
        />
        <main className="main-content">
          <AudienceDetail
            audience={data.audiences[selectedAudienceIndex]}
            index={selectedAudienceIndex}
            onChange={handleAudienceChange}
            onBack={() => setSelectedAudienceIndex(null)}
            globalWritingRules={data.brandFoundations.writingRules}
            allAudiences={data.audiences}
            allContentTypes={data.contentTypes}
            allRegions={data.regions}
            onUpdateGlobalRules={(rules) => setData({ ...data, brandFoundations: { ...data.brandFoundations, writingRules: rules } })}
            onViewAllRules={() => setShowAllWritingRules(true)}
          />
        </main>
      </div>
    );
  }

  // If a content type is selected, show the full-page detail view
  if (selectedContentTypeIndex !== null && activeTab === 'content-types') {
    const handleContentTypeChange = (updatedContentType: typeof data.contentTypes[0]) => {
      const updated = [...data.contentTypes];
      updated[selectedContentTypeIndex] = updatedContentType;
      setData({ ...data, contentTypes: updated });
    };

    return (
      <div className="app">
        <Sidebar 
          activeSection="brand-kit" 
          onClearStorage={handleClearStorage}
          selectedVersion={selectedVersion}
          onVersionChange={handleVersionChange}
          onSettingsClick={() => setShowSettings(true)}
          onBrandKitClick={() => setShowSettings(false)}
        />
        <main className="main-content">
          <ContentTypeDetail
            contentType={data.contentTypes[selectedContentTypeIndex]}
            onChange={handleContentTypeChange}
            onBack={() => setSelectedContentTypeIndex(null)}
            globalWritingRules={data.brandFoundations.writingRules}
            allContentTypes={data.contentTypes}
            onViewAllRules={() => setShowAllWritingRules(true)}
          />
        </main>
      </div>
    );
  }

  // If a region is selected, show the full-page detail view
  if (selectedRegionIndex !== null && activeTab === 'regions') {
    const handleRegionChange = (updatedRegion: typeof data.regions[0]) => {
      const updated = [...data.regions];
      updated[selectedRegionIndex] = updatedRegion;
      setData({ ...data, regions: updated });
    };

    return (
      <div className="app">
        <Sidebar 
          activeSection="brand-kit" 
          onClearStorage={handleClearStorage}
          selectedVersion={selectedVersion}
          onVersionChange={handleVersionChange}
          onSettingsClick={() => setShowSettings(true)}
          onBrandKitClick={() => setShowSettings(false)}
        />
        <main className="main-content">
          <RegionDetail
            region={data.regions[selectedRegionIndex]}
            onChange={handleRegionChange}
            onBack={() => setSelectedRegionIndex(null)}
            globalWritingRules={data.brandFoundations.writingRules}
            allAudiences={data.audiences}
            allContentTypes={data.contentTypes}
            allRegions={data.regions}
            onUpdateGlobalRules={(rules) => setData({ ...data, brandFoundations: { ...data.brandFoundations, writingRules: rules } })}
            onViewAllRules={() => setShowAllWritingRules(true)}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <Sidebar 
        activeSection="brand-kit" 
        onClearStorage={handleClearStorage}
        selectedVersion={selectedVersion}
        onVersionChange={handleVersionChange}
        onSettingsClick={() => setShowSettings(true)}
        onBrandKitClick={() => setShowSettings(false)}
      />
      <main className="main-content">
        <div className="content-header">
          <h1>Brand Kit</h1>
          <VersionSwitcher 
            selectedVersion={selectedVersion} 
            onVersionChange={handleVersionChange} 
          />
        </div>
        <TabNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          enableRegions={data.brandFoundations.enableRegions ?? true}
          enableAudiences={data.brandFoundations.enableAudiences ?? true}
        />
        <div className="content-body">
          {renderActiveTab()}
        </div>
      </main>
    </div>
  );
}

export default App;
