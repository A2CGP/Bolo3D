import { Color3 } from '../numerics/Color';
import { Matrix4 } from '../numerics/Matrix';
import { Vector3 } from '../numerics/Vector';
import A2DrawableObject from './A2DrawableObject';
import A2EditMesh from './A2EditMesh';
import A2Geometry from './A2Geometry';

class A2Mesh extends A2DrawableObject {
  position = Vector3.zero();
  scale = Vector3.one();

  modelMatrix = Matrix4.identity();

  color = new Color3(0.8, 0.8, 0.8);

  geometry: A2Geometry;
  editMesh: A2EditMesh | null = null;

  constructor(geometry: A2Geometry) {
    super();
    this.geometry = geometry;
    this.displayName = `Mesh${this.objectId}`;
  }
}

export default A2Mesh;