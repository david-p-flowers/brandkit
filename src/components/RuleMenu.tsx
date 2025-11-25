import { useState, useRef, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface Props {
  onEdit: () => void;
  onDelete: () => void;
}

export const RuleMenu = ({ onEdit, onDelete }: Props) => {
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

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    onEdit();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    onDelete();
  };

  return (
    <div className="rule-menu-container" ref={menuRef}>
      <button
        type="button"
        className="btn-ellipsis"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        title="More options"
      >
        ⋯
      </button>
      {isOpen && (
        <div className="rule-menu-dropdown">
          <button
            type="button"
            className="rule-menu-item"
            onClick={handleEdit}
          >
            <Edit size={16} className="rule-menu-icon" />
            <span>Edit</span>
          </button>
          <div className="rule-menu-divider"></div>
          <button
            type="button"
            className="rule-menu-item rule-menu-item-danger"
            onClick={handleDelete}
          >
            <Trash2 size={16} className="rule-menu-icon" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

