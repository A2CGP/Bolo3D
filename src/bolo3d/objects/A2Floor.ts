import A2Geometry, { A2GeometryType } from '../classes/A2Geometry';
import A2Mesh from '../classes/A2Mesh';
import { A2PrimitiveMode } from '../classes/A2Primitive';
import { Color3 } from '../numerics/Color';

class A2FloorGeometry extends A2Geometry {
  constructor(size = 100.0, gutter = 1.0) {
    super(A2GeometryType.Plane);

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

class A2Floor extends A2Mesh {
  primitiveMode = A2PrimitiveMode.LINES;
  color = new Color3(0.32, 0.32, 0.32);

  constructor(size = 100.0, gutter = 1.0) {
    super(new A2FloorGeometry(size, gutter));
  }
}

export default A2Floor;