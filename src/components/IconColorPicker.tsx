import { useState } from 'react';
import * as LucideIcons from 'lucide-react';

interface IconColorPickerProps {
  currentIcon?: string;
  currentColor?: string;
  onIconChange: (icon: string) => void;
  onColorChange: (color: string) => void;
  onClose: () => void;
}

type IconType = 'icon' | 'emoji';

// Popular emojis for selection
const popularEmojis = [
  '📦', '📦', '🛍️', '🏪', '🚚', '💳',
  '👥', '👤', '✅', '➕', '⭕', '👤',
  '📝', '📄', '💻', '🖼️', '🎥', '🎵',
  '🌍', '📍', '🧭', '🧭', '🗺️',
  '⚙️', '🔧', '🔨', '🛠️', '🎚️',
  '📊', '📈', '📉', '📈', '📊',
  '📧', '💬', '📞', '🔔',
  '❤️', '⭐', '🔖', '🚩', '🏷️',
  '🏠', '🏢', '🏭', '🏭', '🏭',
  '⚡', '💡', '🔥', '💧', '☀️',
  '☕', '🍴', '🛍️', '🎁', '🎂',
  '🎮', '🏆', '🏅', '🎖️', '👑',
  '🔒', '🛡️', '🔑', '👆', '👁️',
  '🔍', '🔎', '📋', '⚏', '📐',
  '➕', '➖', '✅', '❌', '⚠️',
  '➡️', '⬅️', '⬆️', '⬇️', '▶️',
  '📅', '🕐', '⏱️', '⏱️', '⏰',
  '💾', '🖥️', '☁️', '💿', '🖥️',
  '📱', '📱', '💻', '🖥️', '🎧',
];

// Popular Lucide icons for selection
const popularIcons = [
  'Package', 'Box', 'ShoppingCart', 'Store', 'Truck', 'CreditCard',
  'Users', 'User', 'UserCheck', 'UserPlus', 'UserCircle',
  'FileText', 'File', 'FileCode', 'Image', 'Video', 'Music',
  'Globe', 'MapPin', 'Navigation', 'Compass', 'Map',
  'Settings', 'Cog', 'Wrench', 'Tool', 'Sliders',
  'BarChart', 'PieChart', 'TrendingUp', 'Activity', 'LineChart',
  'Mail', 'MessageSquare', 'Phone', 'Bell',
  'Heart', 'Star', 'Bookmark', 'Flag', 'Tag',
  'Home', 'Building', 'Building2', 'Warehouse', 'Factory',
  'Zap', 'Lightbulb', 'Flame', 'Droplet', 'Sun',
  'Coffee', 'Utensils', 'ShoppingBag', 'Gift', 'Cake',
  'Gamepad2', 'Trophy', 'Award', 'Medal', 'Crown',
  'Lock', 'Shield', 'Key', 'Fingerprint', 'Eye',
  'Search', 'Filter', 'List', 'Grid', 'Layout',
  'Plus', 'Minus', 'Check', 'X', 'AlertCircle',
  'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'ChevronRight',
  'Calendar', 'Clock', 'Timer', 'Stopwatch', 'AlarmClock',
  'Database', 'Server', 'Cloud', 'HardDrive', 'Cpu',
  'Smartphone', 'Tablet', 'Laptop', 'Monitor', 'Headphones',
];

const colors = [
  { name: 'Grey', value: '#808593', bg: 'rgba(128, 133, 147, 0.1)' },
  { name: 'Dark Grey', value: '#2f2f37', bg: 'rgba(47, 47, 55, 0.1)' },
  { name: 'Purple', value: '#6e6eff', bg: 'rgba(110, 110, 255, 0.1)' },
  { name: 'Blue', value: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  { name: 'Green', value: '#00b285', bg: 'rgba(0, 178, 133, 0.1)' },
  { name: 'Yellow', value: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)' },
  { name: 'Orange', value: '#ff774d', bg: 'rgba(255, 119, 77, 0.1)' },
  { name: 'Pink', value: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)' },
  { name: 'Red', value: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
];

export const IconColorPicker = ({ currentIcon, currentColor, onIconChange, onColorChange, onClose }: IconColorPickerProps) => {
  // Determine if current selection is an emoji or icon
  const isCurrentEmoji = currentIcon && !popularIcons.includes(currentIcon) && /[\u{1F300}-\u{1F9FF}]/u.test(currentIcon);
  const [iconType, setIconType] = useState<IconType>(isCurrentEmoji ? 'emoji' : 'icon');
  const [selectedIcon, setSelectedIcon] = useState(currentIcon || 'Package');
  const [selectedEmoji, setSelectedEmoji] = useState(isCurrentEmoji ? currentIcon : '📦');
  const [selectedColor, setSelectedColor] = useState(currentColor || colors[2].value);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIcons = popularIcons.filter(iconName =>
    iconName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEmojis = popularEmojis.filter(emoji =>
    emoji.includes(searchQuery) || searchQuery === ''
  );

  const handleIconSelect = (iconName: string) => {
    setSelectedIcon(iconName);
    setIconType('icon');
    onIconChange(iconName);
  };

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    setIconType('emoji');
    onIconChange(emoji);
  };

  const handleColorSelect = (colorValue: string) => {
    setSelectedColor(colorValue);
    onColorChange(colorValue);
  };

  const IconComponent = iconType === 'icon' 
    ? ((LucideIcons as any)[selectedIcon] || LucideIcons.Package)
    : null;

  return (
    <div className="icon-color-picker-overlay" onClick={onClose}>
      <div className="icon-color-picker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="icon-color-picker-header">
          <h3>Choose Icon & Color</h3>
          <button type="button" className="icon-color-picker-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="icon-color-picker-content">
          {/* Preview */}
          <div className="icon-color-picker-preview">
            <div 
              className="icon-preview-box"
              style={{
                backgroundColor: colors.find(c => c.value === selectedColor)?.bg || 'rgba(110, 110, 255, 0.1)',
                color: selectedColor,
              }}
            >
              {iconType === 'emoji' ? (
                <span style={{ fontSize: '24px' }}>{selectedEmoji}</span>
              ) : (
                IconComponent && <IconComponent size={24} />
              )}
            </div>
            <div className="icon-preview-info">
              <div className="icon-preview-name">
                {iconType === 'emoji' ? selectedEmoji : selectedIcon}
              </div>
              <div className="icon-preview-color" style={{ color: selectedColor }}>
                {colors.find(c => c.value === selectedColor)?.name || 'Custom'}
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div className="icon-color-picker-section">
            <label className="icon-color-picker-label">Color</label>
            <div className="color-palette">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`color-swatch ${selectedColor === color.value ? 'selected' : ''}`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => handleColorSelect(color.value)}
                  title={color.name}
                >
                  {selectedColor === color.value && (
                    <span className="color-checkmark">✓</span>
                  )}
                </button>
              ))}
              <button
                type="button"
                className="color-custom-button"
                title="Custom color"
              >
                #
              </button>
            </div>
          </div>

          {/* Icon/Emoji Selection */}
          <div className="icon-color-picker-section">
            <div className="icon-type-tabs">
              <button
                type="button"
                className={`icon-type-tab ${iconType === 'icon' ? 'active' : ''}`}
                onClick={() => setIconType('icon')}
              >
                Icon
              </button>
              <button
                type="button"
                className={`icon-type-tab ${iconType === 'emoji' ? 'active' : ''}`}
                onClick={() => setIconType('emoji')}
              >
                Emoji
              </button>
            </div>
            
            <div className="icon-search">
              <input
                type="text"
                placeholder={iconType === 'emoji' ? 'Search emojis' : 'Search icons'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="icon-search-input"
              />
            </div>
            
            {iconType === 'icon' ? (
              <div className="icon-grid">
                {filteredIcons.map((iconName) => {
                  const Icon = (LucideIcons as any)[iconName] || LucideIcons.Package;
                  return (
                    <button
                      key={iconName}
                      type="button"
                      className={`icon-grid-item ${selectedIcon === iconName && iconType === 'icon' ? 'selected' : ''}`}
                      onClick={() => handleIconSelect(iconName)}
                      title={iconName}
                    >
                      <Icon size={20} />
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="emoji-grid">
                {filteredEmojis.map((emoji, index) => (
                  <button
                    key={`${emoji}-${index}`}
                    type="button"
                    className={`emoji-grid-item ${selectedEmoji === emoji && iconType === 'emoji' ? 'selected' : ''}`}
                    onClick={() => handleEmojiSelect(emoji)}
                    title={emoji}
                  >
                    <span style={{ fontSize: '20px' }}>{emoji}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="icon-color-picker-footer">
          <button type="button" className="btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

