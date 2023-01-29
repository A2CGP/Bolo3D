import { FC } from 'react';
import cx from 'classnames';
import './index.less';

export interface FlexProps {
  [name: string]: any;
}

export interface FlexRowProps extends FlexProps { }

export interface FlexColumnProps extends FlexProps { }

export const Row: FC<FlexRowProps> = ({ children, className, ...props }) => {
  return <div className={cx('nuwa-flex-row', className)} {...props}>{children}</div>;
};

export const Column: FC<FlexColumnProps> = ({ children, className, ...props }) => {
  return <div className={cx('nuwa-flex-column', className)} {...props}>{children}</div>;
};

export default { Row, Column };