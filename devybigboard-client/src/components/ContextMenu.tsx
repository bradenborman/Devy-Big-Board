import React, { useEffect, useRef } from 'react';
import './contextMenu.scss';

interface MenuPosition {
    x: number;
    y: number;
}

interface ContextMenuProps {
    visible: boolean;
    position: MenuPosition;
    onClose: () => void;
    onClearBoard: () => void;
    onExportDraft: () => void;
    onLastPlayerRemove: () => void;
    isBoardPopulated: boolean;
    onAddPlayerClick: () => void;
}


const ContextMenu: React.FC<ContextMenuProps> = ({
    visible,
    position,
    onClose,
    onClearBoard,
    onExportDraft,
    onLastPlayerRemove,
    isBoardPopulated,
    onAddPlayerClick
}) => {
    const menuRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        if (visible) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [visible, onClose]);

    return (
        <ul
            ref={menuRef}
            className={`context-menu ${visible ? 'context-menu-show' : ''}`}
            style={{ left: position.x, top: position.y }}
        >
            <li className={`menu-item ${!isBoardPopulated ? 'menu-item-disabled' : ''}`}>
                <button type="button" className="menu-btn" onClick={isBoardPopulated ? onClearBoard : undefined}>
                    <span className="menu-text">Clear Board</span>
                </button>
            </li>
            <li className={`menu-item ${!isBoardPopulated ? 'menu-item-disabled' : ''}`}>
                <button type="button" className="menu-btn" onClick={isBoardPopulated ? onExportDraft : undefined}>
                    <span className="menu-text">Export Draft</span>
                </button>
            </li>
            <li className="menu-separator" />
            <li className={`menu-item ${!isBoardPopulated ? 'menu-item-disabled' : ''}`}>
                <button type="button" className="menu-btn" onClick={isBoardPopulated ? onLastPlayerRemove : undefined}>
                    <span className="menu-text">Remove Last Pick</span>
                </button>
            </li>
            <li className="menu-separator" />
            <li className="menu-item">
                <button type="button" className="menu-btn" onClick={onAddPlayerClick}>
                    <span className="menu-text">Add Player</span>
                </button>
            </li>

        </ul>

    );
};

export default ContextMenu;
