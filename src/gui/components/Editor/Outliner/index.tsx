import { useEffect, useState } from 'react';
import cx from 'classnames';
import { ObjectType } from '@/core/classes/Object3D';
import DrawableObject from '@/core/classes/DrawableObject';
import Mesh from '@/core/classes/Mesh';
import { GeometryType } from '@/core/classes/Geometry';
import GlobalContext from '@/core/GlobalContext';
import Scene from '@/core/scenes/Scene';
import './index.less';

const getClassName = (object: DrawableObject) => {
  if (object.objectType === ObjectType.Camera) {
    return 'icon-camera-full';
  }

  const mesh = object as Mesh;

  switch (mesh.geometry.geometryType) {
    case GeometryType.Polygon:
      return 'icon-mesh-polygon';
    case GeometryType.Plane:
      return 'icon-mesh-plane';
    case GeometryType.Cube:
      return 'icon-mesh-cube';
    case GeometryType.UVSphere:
      return 'icon-mesh-sphere';
    case GeometryType.Torus:
      return 'icon-mesh-torus';
    default:
      return '';
  }
};

const Outliner = () => {
  const [objects, setObjects] = useState<DrawableObject[]>([]);

  useEffect(() => {
    const scene = GlobalContext.current.viewport?.scene;

    if (scene) {
      let initialObjects = (scene as Scene).objectMaps.values();

      setObjects([...initialObjects]);
      scene.on('add', () => {
        initialObjects = (scene as Scene).objectMaps.values();
        setObjects([...initialObjects]);
      });
      scene.on('delete', () => {
        initialObjects = (scene as Scene).objectMaps.values();
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