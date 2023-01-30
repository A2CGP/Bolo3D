import Geometry, { GeometryType } from '@/core/classes/Geometry';
import Mesh from '@/core/classes/Mesh';

class FloorGeometry extends Geometry {
  constructor(size = 100.0, gutter = 1.0) {
    super(GeometryType.Plane);

    const half = Math.round(size / 2.0);
    const indices = [];
    const vertices = [];
    let index = 0;

    for (let i = -half; i <= half; i += gutter) {
      vertices.push(i, 0, half, i, 0, -half);
      indices.push(index++, index++);
    }
    for (let i = -half; i <= half; i += gutter) {
      vertices.push(-half, 0, i, half, 0, i);
      indices.push(index++, index++);
    }
    this.setFlatLineIndices(indices);
    this.setFlatVertices(vertices);
  }
}

class Floor extends Mesh {
  constructor(size = 100.0, gutter = 1.0) {
    super(new FloorGeometry(size, gutter));
  }
}

export default Floor;