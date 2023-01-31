import { useEffect, useState } from 'react';
import cx from 'classnames';
import SceneObject, { SceneMesh } from '@/core/scene/SceneObject';
import { GeometryType } from '@/core/classes/Geometry';
import GlobalContext from '@/core/GlobalContext';
import Scene from '@/core/scene/Scene';
import './index.less';

const getClassName = (object: SceneObject) => {
  const mesh = object as SceneMesh;

  switch (mesh.item.geometry.geometryType) {
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
  const [objects, setObjects] = useState<SceneObject[]>([]);

  useEffect(() => {
    const scene = GlobalContext.current.viewport?.scene;

    if (scene) {
      let initialObjects = (scene as Scene).objectMap.values();

      setObjects([...initialObjects]);
      scene.on('add', () => {
        initialObjects = (scene as Scene).objectMap.values();
        setObjects([...initialObjects]);
      });
      scene.on('delete', () => {
        initialObjects = (scene as Scene).objectMap.values();
        setObjects([...initialObjects]);
      });
    }
  }, []);

  return (
    <div className='nuwa-editor-outliner'>
      <div className='nuwa-editor-outliner-body'>
      {objects.map((object) => (
        <div key={object.id} className='nuwa-editor-outliner-item'>
          <span className={cx('iconfont', getClassName(object))}></span>
          <span>{object.displayName}</span>
        </div>
      ))}
      </div>
    </div>
  );
};

export default Outliner;