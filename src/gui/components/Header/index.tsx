import { FC } from 'react';
import cx from 'classnames';
import './index.less';

export interface HeaderProps {
  [name: string]: any;
}

const Header: FC<HeaderProps> = ({ className, ...props }) => {
  return (
    <div className={cx('nuwa-header', className)} {...props}>
      <div className='nuwa-header-item'>
      <span className='iconfont icon-editor-viewport'></span>
      </div>
      <div className='nuwa-header-item'>
        <div className='nuwa-header-overlay'>
          <span className='iconfont icon-header-overlay'></span>
        </div>
        <div className='nuwa-header-xray'>
          <span className='iconfont icon-header-xray'></span>
        </div>
        <div className='nuwa-header-shading'>
          <span className='iconfont icon-shading-wireframe'></span>
          <span className='iconfont icon-shading-solid'></span>
          <span className='iconfont icon-shading-material'></span>
          <span className='iconfont icon-shading-rendered'></span>
        </div>
      </div>
    </div>
  );
};

export default Header;