import { Color3 } from '../../math/Color';
import { Matrix4 } from '@/math/Matrix';
import { Vector3 } from '@/math/Vector';
import { SceneMesh } from './SceneObject';
import EditMesh from './EditMesh';
import Geometry from './Geometry';

class Mesh extends SceneMesh {
  position = Vector3.zero();
  scale = Vector3.one();

  modelMatrix = Matrix4.identity();

  color = new Color3(0.8, 0.8, 0.8);

  geometry: Geometry;
  editMesh: EditMesh | null = null;

  constructor(geometry: Geometry) {
    super();
    this.geometry = geometry;
    this.displayName = `Mesh${this.objectId}`;
  }
}

export default Mesh;