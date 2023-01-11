import { useEffect, useState } from 'react';
import cx from 'classnames';
import { A2ObjectType } from '@/classes/A2Object';
import A2DrawableObject from '@/classes/A2DrawableObject';
import A2Mesh from '@/classes/A2Mesh';
import { A2GeometryType } from '@/classes/A2Geometry';
import A2GlobalContext from '@/globals/A2GlobalContext';
import A2Scene from '@/scenes/A2Scene';
import './index.less';

const getClassName = (object: A2DrawableObject) => {
  if (object.objectType === A2ObjectType.Camera) {
    return 'icon-camera-full';
  }

  const mesh = object as A2Mesh;

  switch (mesh.geometry.geometryType) {
    case A2GeometryType.Polygon:
      return 'icon-mesh-polygon';
    case A2GeometryType.Plane:
      return 'icon-mesh-plane';
    case A2GeometryType.Cube:
      return 'icon-mesh-cube';
    case A2GeometryType.UVSphere:
      return 'icon-mesh-sphere';
    case A2GeometryType.Torus:
      return 'icon-mesh-torus';
    default:
      return '';
  }
};

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
      <div className='nuwa-editor-outliner-body'>
      {objects.map((object) => (
        <div key={object.objectId} className='nuwa-editor-outliner-item'>
          <span className={cx('iconfont', getClassName(object))}></span>
          <span>{object.displayName}</span>
        </div>
      ))}
      </div>
    </div>
  );
};

export default Outliner;