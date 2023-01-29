import Menu, { MenuItem, MenuProps } from '../Menu';
import { FC } from 'react';
import './index.less';

export interface ContextMenuProps {
  onItemClick?: MenuProps['onItemClick'];
}

const ContextMenu: FC<ContextMenuProps> = ({ onItemClick }) => {
  const items: MenuItem[] = [
    { key: 'Cube', label: 'Cube' },
    { key: 'UVSphere', label: 'UVSphere' },
    { key: 'Torus', label: 'Torus' },
    { key: 'Divider', label: '', divider: true },
    { key: 'Delete', label: 'Delete' },
  ];
  return (
    <div>
      <Menu title='Add' items= {items} onItemClick={onItemClick} />
    </div>
  );
};

export default ContextMenu;