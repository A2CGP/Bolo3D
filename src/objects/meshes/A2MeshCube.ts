import A2Geometry, { A2GeometryType } from '@/classes/A2Geometry';
import A2Mesh from '@/classes/A2Mesh';

class A2CubeGeometry extends A2Geometry {
  constructor() {
    super(A2GeometryType.Cube);
    this.setFlatIndices([
      // front
      0, 1, 2, 2, 3, 0,
      // back
      4, 5, 6, 6, 7, 4,
      // top
      8, 9, 10, 10, 11, 8,
      // bottom
      12, 13, 14, 14, 15, 12,
      // left
      16, 17, 18, 18, 19, 16,
      // right
      20, 21, 22, 22, 23, 20,
    ]);
    this.setFlatVertices([
      // front
      -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
      // back
      1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0,
      // top
      -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0,
      // bottom
      1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0,
      // left
      -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
      // right
      1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0,
    ]);
    this.setFlatNormals([
      0, 0, 1.0, 0, 0, 1.0, 0, 0, 1.0, 0, 0, 1.0,
      0, 0, -1.0, 0, 0, -1.0, 0, 0, -1.0, 0, 0, -1.0,
      0, 1.0, 0, 0, 1.0, 0, 0, 1.0, 0, 0, 1.0, 0,
      0, -1.0, 0, 0, -1.0, 0, 0, -1.0, 0, 0, -1.0, 0,
      -1.0, 0, 0, -1.0, 0, 0, -1.0, 0, 0, -1.0, 0, 0,
      1.0, 0, 0, 1.0, 0, 0, 1.0, 0, 0, 1.0, 0, 0,
    ]);
  }
}

class A2MeshCube extends A2Mesh {
  constructor() {
    super(new A2CubeGeometry());
    this.displayName = `Cube${this.objectId}`;
  }
}

export default A2MeshCube;