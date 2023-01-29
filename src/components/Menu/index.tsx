import { FC } from 'react';
import GlobalContext from '@/core/GlobalContext';
import './index.less';

export interface MenuItem {
  key: string | number;
  label: string;
  divider?: boolean;
}

export interface MenuProps {
  items: MenuItem[];
  title?: string;
  onItemClick?: (key: MenuItem['key']) => void;
}

const Menu: FC<MenuProps> = ({ items, title, onItemClick }) => {
  const onClick = (key: MenuItem['key']) => {
    const scene = GlobalContext.current.viewport?.scene;

    if (scene) {
      scene.emit('menu-add', key);
    }
    if (onItemClick) onItemClick(key);
  };
  return (
    <div className='nuwa-menu'>
      {title && <div className='nuwa-menu-title'>{title}</div>}
      <div className='nuwa-menu-item-list'>
        {items.map(({ key, label, divider }) => {
          return divider ? <div key={key} className='nuwa-menu-divide'></div> : <div key={key} className='nuwa-menu-item-wrap' onClick={() => onClick(key)}><div className='nuwa-menu-item'>{label}</div></div>;
        })}
      </div>
    </div>
  );
};

export default Menu;