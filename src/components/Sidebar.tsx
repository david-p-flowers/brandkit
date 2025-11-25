import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface SidebarProps {
  activeSection?: string;
  onClearStorage?: () => void;
  selectedVersion?: string;
  onVersionChange?: (version: string) => void;
}

export const Sidebar = ({ activeSection = 'brand-kit', onClearStorage, selectedVersion = 'Default', onVersionChange }: SidebarProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const versions = ['Default', 'Klaviyo', 'Xero'];

  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    // Use mousedown instead of click to avoid conflicts
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleHelpClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClearStorage) {
      // Easter egg: Double-click to clear storage
      const now = Date.now();
      const lastClick = (window as any).__lastHelpClick || 0;
      if (now - lastClick < 500) {
        // Double click detected
        if (confirm('Clear all local storage data? This will reset the app to its initial state.')) {
          onClearStorage();
        }
        (window as any).__lastHelpClick = 0;
      } else {
        (window as any).__lastHelpClick = now;
      }
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-switcher" ref={dropdownRef}>
          <button 
            type="button"
            className="logo-switcher-button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
          >
            <div className="logo">{selectedVersion}</div>
            <ChevronDown size={12} className={`logo-switcher-arrow ${isDropdownOpen ? 'open' : ''}`} />
          </button>
          {isDropdownOpen && (
            <div 
              className="logo-switcher-dropdown"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              {versions.map((version) => (
                <button
                  key={version}
                  type="button"
                  className={`logo-switcher-option ${version === selectedVersion ? 'active' : ''}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (onVersionChange) {
                      onVersionChange(version);
                    }
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
        <button className="btn-new">
          <span>New</span>
          <span className="btn-new-icon">+</span>
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <a href="#" className="nav-item">
            <span className="nav-icon">🏠</span>
            <span>Home</span>
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">🔍</span>
            <span>Search</span>
          </a>
        </div>

        <div className="nav-section">
          <div className="nav-section-header">Action</div>
          <a href="#" className="nav-item">
            <span className="nav-icon">📁</span>
            <span>Browse</span>
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">⊞</span>
            <span>Recent Grids</span>
            <span className="nav-arrow">→</span>
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">⚡</span>
            <span>Recent Workflows</span>
            <span className="nav-arrow">→</span>
          </a>
        </div>

        <div className="nav-section">
          <div className="nav-section-header">Insights</div>
          <a href="#" className="nav-item">
            <span className="nav-icon">📊</span>
            <span>Analytics</span>
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">💡</span>
            <span>Opportunities</span>
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">📄</span>
            <span>Pages</span>
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">💬</span>
            <span>Prompts</span>
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">📚</span>
            <span>Citations</span>
          </a>
        </div>

        <div className="nav-section">
          <div className="nav-section-header">Context</div>
          <a href="#" className={`nav-item ${activeSection === 'brand-kit' ? 'active' : ''}`}>
            <span className="nav-icon">💼</span>
            <span>Brand Kit</span>
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">📖</span>
            <span>Knowledge Base</span>
          </a>
        </div>
      </nav>

      <div className="sidebar-footer">
        <a href="#" className="nav-item">
          <span className="nav-icon">⚙️</span>
          <span>Settings</span>
        </a>
        <a href="#" className="nav-item">
          <span className="nav-icon">📈</span>
          <span>Usage</span>
        </a>
        <a href="#" className="nav-item">
          <span className="nav-icon">🎓</span>
          <span>Learning Hub</span>
        </a>
        <a href="#" className="nav-item" onClick={handleHelpClick}>
          <span className="nav-icon">❓</span>
          <span>Help + Support</span>
        </a>
      </div>
    </aside>
  );
};

