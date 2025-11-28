import React, { useState, useRef } from 'react';
import { ArrowLeft, User, Globe, Database, CreditCard, Users, Plug, Lock, RefreshCw, BookOpen, Upload } from 'lucide-react';
import type { BrandKitSchema } from '../types';
import { IconColorPicker } from './IconColorPicker';
import * as LucideIcons from 'lucide-react';

interface SettingsProps {
  onBack: () => void;
  data: BrandKitSchema;
  onChange: (data: BrandKitSchema) => void;
}

export const Settings = ({ onBack, data, onChange }: SettingsProps) => {
  const [activeSubSection, setActiveSubSection] = useState('personal-information');
  const [showIconColorPicker, setShowIconColorPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Get settings from data, default to true if not set
  const enableRegions = data.brandFoundations.enableRegions ?? true;
  const enableAudiences = data.brandFoundations.enableAudiences ?? true;

  const updateBrandFoundation = (field: string, value: any) => {
    onChange({
      ...data,
      brandFoundations: {
        ...data.brandFoundations,
        [field]: value
      }
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateBrandFoundation('brandIcon', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoEdit = () => {
    // Show a menu or modal to choose between icon picker and upload
    const choice = window.confirm('Choose upload method:\nOK = Upload Image\nCancel = Choose Icon');
    if (choice) {
      fileInputRef.current?.click();
    } else {
      setShowIconColorPicker(true);
    }
  };

  const handleIconChange = (icon: string) => {
    updateBrandFoundation('brandIcon', icon);
    setShowIconColorPicker(false);
  };

  const handleColorChange = () => {
    // For brand icon, we might not need color, but keeping for consistency
    setShowIconColorPicker(false);
  };

  const getBrandIconDisplay = () => {
    const icon = data.brandFoundations.brandIcon;
    if (!icon) return null;
    
    if (icon.startsWith('http') || icon.startsWith('data:')) {
      return <img src={icon} alt="Brand logo" className="settings-brand-icon-img" />;
    }
    
    // Check if it's an emoji
    if (/[\u{1F300}-\u{1F9FF}]/u.test(icon)) {
      return <span className="settings-brand-icon-emoji">{icon}</span>;
    }
    
    // It's a Lucide icon name
    const IconComponent = (LucideIcons as any)[icon];
    if (IconComponent) {
      return <IconComponent size={24} />;
    }
    
    return null;
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <button 
          type="button"
          className="settings-back-button"
          onClick={onBack}
        >
          <ArrowLeft size={20} />
        </button>
        <h1>Settings</h1>
      </div>

      <div className="settings-container">
        <div className="settings-sidebar">
          <div className="settings-nav-section">
            <div className="settings-nav-header">General</div>
            <button
              type="button"
              className={`settings-nav-item ${activeSubSection === 'personal-information' ? 'active' : ''}`}
              onClick={() => setActiveSubSection('personal-information')}
            >
              <User size={16} />
              <span>Personal Information</span>
            </button>
          </div>

          <div className="settings-nav-section">
            <div className="settings-nav-header">Workspace</div>
            <button
              type="button"
              className={`settings-nav-item ${activeSubSection === 'workspace' ? 'active' : ''}`}
              onClick={() => setActiveSubSection('workspace')}
            >
              <Globe size={16} />
              <span>Workspace</span>
            </button>
            <button
              type="button"
              className={`settings-nav-item ${activeSubSection === 'brand-kit' ? 'active' : ''}`}
              onClick={() => setActiveSubSection('brand-kit')}
            >
              <BookOpen size={16} />
              <span>Brand Kit</span>
            </button>
            <button
              type="button"
              className={`settings-nav-item ${activeSubSection === 'databases' ? 'active' : ''}`}
              onClick={() => setActiveSubSection('databases')}
            >
              <Database size={16} />
              <span>Databases</span>
            </button>
            <button
              type="button"
              className={`settings-nav-item ${activeSubSection === 'billing' ? 'active' : ''}`}
              onClick={() => setActiveSubSection('billing')}
            >
              <CreditCard size={16} />
              <span>Billing</span>
            </button>
            <button
              type="button"
              className={`settings-nav-item ${activeSubSection === 'team' ? 'active' : ''}`}
              onClick={() => setActiveSubSection('team')}
            >
              <Users size={16} />
              <span>Team</span>
            </button>
            <button
              type="button"
              className={`settings-nav-item ${activeSubSection === 'api-providers' ? 'active' : ''}`}
              onClick={() => setActiveSubSection('api-providers')}
            >
              <Plug size={16} />
              <span>API Providers</span>
            </button>
            <button
              type="button"
              className={`settings-nav-item ${activeSubSection === 'sso' ? 'active' : ''}`}
              onClick={() => setActiveSubSection('sso')}
            >
              <Lock size={16} />
              <span>Single Sign On</span>
            </button>
            <button
              type="button"
              className={`settings-nav-item ${activeSubSection === 'integrations' ? 'active' : ''}`}
              onClick={() => setActiveSubSection('integrations')}
            >
              <RefreshCw size={16} />
              <span>Integrations</span>
            </button>
            <button
              type="button"
              className={`settings-nav-item ${activeSubSection === 'secrets' ? 'active' : ''}`}
              onClick={() => setActiveSubSection('secrets')}
            >
              <Lock size={16} />
              <span>Secrets</span>
            </button>
          </div>
        </div>

        <div className="settings-content">
          {activeSubSection === 'brand-kit' && (
            <div className="settings-section">
              <div className="settings-brand-kit-header">
                <h2>Brand Kit</h2>
                <p className="settings-description">Customize how your brand appears in your brand kit.</p>
              </div>

              <div className="detail-section">
                <div className="detail-section-header">
                  <div className="detail-section-header-row">
                    <div>
                      <h3>Audiences</h3>
                      <p className="detail-section-description">Enable audience-specific content and rules</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={enableAudiences}
                        onChange={(e) => updateBrandFoundation('enableAudiences', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <div className="detail-section-header">
                  <div className="detail-section-header-row">
                    <div>
                      <h3>Regions</h3>
                      <p className="detail-section-description">Enable region-specific content and rules</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={enableRegions}
                        onChange={(e) => updateBrandFoundation('enableRegions', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                style={{ display: 'none' }}
              />

              {showIconColorPicker && (
                <div className="settings-icon-picker-overlay" onClick={() => setShowIconColorPicker(false)}>
                  <div className="settings-icon-picker-container" onClick={(e) => e.stopPropagation()}>
                    <IconColorPicker
                      currentIcon={data.brandFoundations.brandIcon}
                      currentColor={data.brandFoundations.brandColors?.primary}
                      onIconChange={handleIconChange}
                      onColorChange={handleColorChange}
                      onClose={() => setShowIconColorPicker(false)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSubSection === 'personal-information' && (
            <div className="settings-section">
              <h2>Personal Information</h2>
              <div className="settings-form">
                <div className="settings-avatar-section">
                  <div className="settings-avatar">
                    <span>D</span>
                  </div>
                </div>
                <div className="settings-field-group">
                  <label className="settings-label">First Name</label>
                  <input
                    type="text"
                    className="settings-input"
                    defaultValue="David"
                  />
                </div>
                <div className="settings-field-group">
                  <label className="settings-label">Last Name</label>
                  <input
                    type="text"
                    className="settings-input"
                    defaultValue="Flowers"
                  />
                </div>
                <div className="settings-field-group">
                  <label className="settings-label">Role</label>
                  <select className="settings-select">
                    <option>Admin</option>
                    <option>Member</option>
                    <option>Viewer</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeSubSection === 'workspace' && (
            <div className="settings-section">
              <h2>Workspace</h2>
              <p className="settings-description">Manage your workspace settings and preferences.</p>
            </div>
          )}

          {activeSubSection === 'databases' && (
            <div className="settings-section">
              <h2>Databases</h2>
              <p className="settings-description">Configure and manage your database connections.</p>
            </div>
          )}

          {activeSubSection === 'billing' && (
            <div className="settings-section">
              <h2>Billing</h2>
              <p className="settings-description">Manage your subscription and billing information.</p>
            </div>
          )}

          {activeSubSection === 'team' && (
            <div className="settings-section">
              <h2>Team</h2>
              <p className="settings-description">Manage team members and permissions.</p>
            </div>
          )}

          {activeSubSection === 'api-providers' && (
            <div className="settings-section">
              <h2>API Providers</h2>
              <p className="settings-description">Configure API providers and credentials.</p>
            </div>
          )}

          {activeSubSection === 'sso' && (
            <div className="settings-section">
              <h2>Single Sign On</h2>
              <p className="settings-description">Configure SSO authentication for your workspace.</p>
            </div>
          )}

          {activeSubSection === 'integrations' && (
            <div className="settings-section">
              <h2>Integrations</h2>
              <p className="settings-description">Manage third-party integrations.</p>
            </div>
          )}

          {activeSubSection === 'secrets' && (
            <div className="settings-section">
              <h2>Secrets</h2>
              <p className="settings-description">Manage API keys and secrets securely.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

