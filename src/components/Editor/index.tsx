import { FC, ReactNode } from 'react';
import Viewport3D from './Viewport3D';
import Outliner from './Outliner';
import Properties from './Properties';
import './index.less';

export enum EditorType {
  Viewport3D,
  Outliner,
  Propperties,
}

export interface EditorProps {
  type?: EditorType;
}

const Editor: FC<EditorProps> = ({ type = EditorType.Viewport3D }) => {
  let instance: ReactNode | null = null;

  switch (type) {
    case EditorType.Viewport3D:
      instance = <Viewport3D />;
      break;
    case EditorType.Outliner:
      instance = <Outliner />;
      break;
    case EditorType.Propperties:
      instance = <Properties />;
      break;
  }
  return <div className='nuwa-editor'>{instance}</div>;
};

export default Editor;