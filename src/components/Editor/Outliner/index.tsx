import A2DrawableObject from '@/classes/A2DrawableObject';
import A2GlobalContext from '@/globals/A2GlobalContext';
import A2Scene from '@/scenes/A2Scene';
import { useEffect, useState } from 'react';
import './index.less';

const Outliner = () => {
  const [objects, setObjects] = useState<A2DrawableObject[]>([]);

  useEffect(() => {
    const scene = A2GlobalContext.current.viewport?.scene;

    if (scene) {
      let initialObjects = (scene as A2Scene).objectMaps.values();

      setObjects([...initialObjects]);
      scene.on('add', () => {
        initialObjects = (scene as A2Scene).objectMaps.values();
        setObjects([...initialObjects]);
      });
      scene.on('delete', () => {
        initialObjects = (scene as A2Scene).objectMaps.values();
        setObjects([...initialObjects]);
      });
    }
  }, []);

  return (
    <div className='nuwa-editor-outliner'>
      {objects.map(({ objectId, displayName }) => <div key={objectId}>{displayName}</div>)}
    </div>
  );
};

export default Outliner;