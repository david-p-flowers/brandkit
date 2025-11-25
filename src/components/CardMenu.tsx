import { useState, useRef, useEffect } from 'react';

interface Props {
  onDuplicate: () => void;
  onDelete: () => void;
}

export const CardMenu = ({ onDuplicate, onDelete }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    onDuplicate();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    onDelete();
  };

  return (
    <div className="card-menu-container" ref={menuRef}>
      <button
        type="button"
        className="card-menu-button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        title="More options"
      >
        <span className="card-menu-dots">⋯</span>
      </button>
      {isOpen && (
        <div className="card-menu-dropdown">
          <button
            type="button"
            className="card-menu-item"
            onClick={handleDuplicate}
          >
            <svg className="card-menu-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="6" height="6" stroke="currentColor" strokeWidth="1.5" fill="none" rx="1"/>
              <rect x="8" y="8" width="6" height="6" stroke="currentColor" strokeWidth="1.5" fill="none" rx="1"/>
            </svg>
            <span>Duplicate</span>
          </button>
          <div className="card-menu-divider"></div>
          <button
            type="button"
            className="card-menu-item card-menu-item-danger"
            onClick={handleDelete}
          >
            <svg className="card-menu-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 2V1C5 0.447715 5.44772 0 6 0H10C10.5523 0 11 0.447715 11 1V2H13C13.5523 2 14 2.44772 14 3C14 3.55228 13.5523 4 13 4H12V13C12 13.5523 11.5523 14 11 14H5C4.44772 14 4 13.5523 4 13V4H3C2.44772 4 2 3.55228 2 3C2 2.44772 2.44772 2 3 2H5ZM6 1V2H10V1H6Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M6 6V11M10 6V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

