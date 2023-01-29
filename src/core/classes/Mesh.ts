import { Color3 } from '../../math/Color';
import { Matrix4 } from '@/math/Matrix';
import { Vector3 } from '@/math/Vector';
import A2DrawableObject from './DrawableObject';
import A2EditMesh from './EditMesh';
import A2Geometry from './Geometry';

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