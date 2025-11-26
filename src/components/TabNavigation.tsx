interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'brand-foundations', label: 'Foundations' },
  { id: 'product-lines', label: 'Product Lines' },
  { id: 'audiences', label: 'Audiences' },
  { id: 'content-types', label: 'Content Types' },
  { id: 'regions', label: 'Regions' },
];

export const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
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

