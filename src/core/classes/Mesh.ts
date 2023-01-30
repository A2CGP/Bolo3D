import { Matrix4 } from '@/math/Matrix';
import { Vector3 } from '@/math/Vector';
import EditMesh from './EditMesh';
import Geometry from './Geometry';

class Mesh {
  position = Vector3.zero();
  scale = Vector3.one();

  modelMatrix = Matrix4.identity();

  geometry: Geometry;
  editMesh: EditMesh | null = null;

  constructor(geometry: Geometry) {
    this.geometry = geometry;
  }
}

export default Mesh;