interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  enableRegions?: boolean;
  enableAudiences?: boolean;
}

const allTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'brand-foundations', label: 'Foundations' },
  { id: 'product-lines', label: 'Product Lines' },
  { id: 'content-types', label: 'Content Types' },
  { id: 'audiences', label: 'Audiences' },
  { id: 'regions', label: 'Regions' },
];

export const TabNavigation = ({ activeTab, onTabChange, enableRegions = true, enableAudiences = true }: TabNavigationProps) => {
  const tabs = allTabs.filter(tab => {
    if (tab.id === 'regions' && !enableRegions) return false;
    if (tab.id === 'audiences' && !enableAudiences) return false;
    return true;
  });

  return (
    <div className="tab-navigation">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

