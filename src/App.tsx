import { useState, useEffect, useRef } from 'react';
import type { BrandKitSchema, ProductLine, WritingRule } from './types';
import { saveToLocalStorage, loadFromLocalStorage, getEmptySchema, clearLocalStorage } from './utils/storage';
import { getKlaviyoData } from './utils/klaviyoData';
import { getXeroData } from './utils/xeroData';
import { Sidebar } from './components/Sidebar';
import { TabNavigation } from './components/TabNavigation';
import { BrandFoundations } from './components/BrandFoundations';
import { ProductLines } from './components/ProductLines';
import { ProductDetail } from './components/ProductDetail';
import { ContentTypes } from './components/ContentTypes';
import { ContentTypeDetail } from './components/ContentTypeDetail';
import { Audiences } from './components/Audiences';
import { AudienceDetail } from './components/AudienceDetail';
import { Regions } from './components/Regions';
import { RegionDetail } from './components/RegionDetail';
import './App.css';

function App() {
  const [data, setData] = useState<BrandKitSchema>(getEmptySchema());
  const [activeTab, setActiveTab] = useState('brand-foundations');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);
  const [selectedAudienceIndex, setSelectedAudienceIndex] = useState<number | null>(null);
  const [selectedContentTypeIndex, setSelectedContentTypeIndex] = useState<number | null>(null);
  const [selectedRegionIndex, setSelectedRegionIndex] = useState<number | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string>('Default');
  const isInitialMount = useRef(true);

  const handleClearStorage = () => {
    clearLocalStorage();
    setData(getEmptySchema());
    setSelectedProductIndex(null);
    setSelectedAudienceIndex(null);
    setSelectedContentTypeIndex(null);
    setSelectedRegionIndex(null);
    setActiveTab('brand-foundations');
    setSelectedVersion('Default');
    isInitialMount.current = true;
  };

  const handleVersionChange = (version: string) => {
    setSelectedVersion(version);
    if (version === 'Klaviyo') {
      const klaviyoData = getKlaviyoData();
      setData(klaviyoData);
      // Save to localStorage with version key
      localStorage.setItem('brand-kit-version', version);
      saveToLocalStorage(klaviyoData);
    } else if (version === 'Xero') {
      const xeroData = getXeroData();
      setData(xeroData);
      // Save to localStorage with version key
      localStorage.setItem('brand-kit-version', version);
      saveToLocalStorage(xeroData);
    } else {
      // Load default/empty schema
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

  // Load data from localStorage on mount
  useEffect(() => {
    const savedVersion = localStorage.getItem('brand-kit-version') || 'Default';
    setSelectedVersion(savedVersion);
    
    if (savedVersion === 'Klaviyo') {
      const klaviyoData = getKlaviyoData();
      setData(klaviyoData);
    } else if (savedVersion === 'Xero') {
      const xeroData = getXeroData();
      setData(xeroData);
    } else {
      const loaded = loadFromLocalStorage();
      if (loaded) {
        setData(loaded);
      }
    }
    isInitialMount.current = false;
  }, []);

  // Auto-save to localStorage whenever data changes
  useEffect(() => {
    // Skip save on initial mount
    if (isInitialMount.current) {
      return;
    }

    setSaveStatus('saving');
    const timer = setTimeout(() => {
      saveToLocalStorage(data);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500); // Debounce saves
    
    return () => clearTimeout(timer);
  }, [data]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'brand-foundations':
        return (
          <BrandFoundations
            data={data.brandFoundations}
            onChange={(brandFoundations) => setData({ ...data, brandFoundations })}
            audiences={data.audiences}
            contentTypes={data.contentTypes}
            regions={data.regions}
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
        />
        <main className="main-content">
          <ProductDetail
            productLine={data.productLines[selectedProductIndex]}
            index={selectedProductIndex}
            onChange={handleProductChange}
            onBack={() => setSelectedProductIndex(null)}
            regions={data.regions}
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
        />
        <main className="main-content">
          <ContentTypeDetail
            contentType={data.contentTypes[selectedContentTypeIndex]}
            index={selectedContentTypeIndex}
            onChange={handleContentTypeChange}
            onBack={() => setSelectedContentTypeIndex(null)}
            globalWritingRules={data.brandFoundations.writingRules}
            allContentTypes={data.contentTypes}
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
        />
        <main className="main-content">
          <RegionDetail
            region={data.regions[selectedRegionIndex]}
            index={selectedRegionIndex}
            onChange={handleRegionChange}
            onBack={() => setSelectedRegionIndex(null)}
            globalWritingRules={data.brandFoundations.writingRules}
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
      />
      <main className="main-content">
        <div className="content-header">
          <h1>Brand Kit</h1>
          <div className="header-actions">
            <div className="save-status">
              {saveStatus === 'saving' && <span className="status-saving">Saving...</span>}
              {saveStatus === 'saved' && <span className="status-saved">✓ Saved</span>}
            </div>
          </div>
        </div>
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="content-body">
          {renderActiveTab()}
        </div>
      </main>
    </div>
  );
}

export default App;
