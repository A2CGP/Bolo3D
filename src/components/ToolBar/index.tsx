import { FC } from 'react';
import cx from 'classnames';
import './index.less';

export interface ToolBarProps {
  [name: string]: any;
}

const ToolBar: FC<ToolBarProps> = ({ className, ...props }) => {
  return <div className={cx('nuwa-toolbar', className)} {...props}></div>;
};

export default ToolBar;