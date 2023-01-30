import Geometry, { GeometryType } from '@/core/classes/Geometry';
import Mesh from '@/core/classes/Mesh';

class TorusGeometry extends Geometry {
  constructor(radius = 1.0, maxU = 32, maxV = 16) {
    super(GeometryType.Torus);
    const inner = radius * 0.75;
    const outer = radius * 0.25;
    const indices: number[] = [];
    const vertices: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const stackStep = Math.PI * 2.0 / maxV;
    const sectorStep = Math.PI * 2.0 / maxU;
    let phi = 0;
    let theta = 0;
    let innerX = 0;
    let innerZ = 0;
    let x = 0;
    let y = 0;
    let z = 0;
    let nx = 0;
    let ny = 0;
    let nz = 0;

    for (let i = 0; i <= maxU; i++) {
      phi = i * sectorStep;
      innerX = Math.cos(phi);
      innerZ = -Math.sin(phi);
      for (let j = 0; j <= maxV; j++) {
        theta = j * stackStep;
        nx = Math.cos(theta) * innerX;
        ny = Math.sin(theta);
        nz = Math.cos(theta) * innerZ;
        x = inner * innerX + outer * nx;
        y = outer * ny;
        z = inner * innerZ + outer * nz;
        vertices.push(x, y, z);
        normals.push(nx, ny, nz);
        uvs.push(i / maxU, j / maxV);
      }
    }
    for (let i = 0, k1, k2; i < maxU; i++) {
      k1 = i * (maxV + 1);
      k2 = k1 + maxV + 1;
      for (let j = 0; j < maxV; j++, k1++, k2++) {
        indices.push(k1 + 1, k1, k2, k2, k2 + 1, k1 + 1);
      }
    }
    this.setSmoothIndices(indices);
    this.setSmoothVertices(vertices);
    this.setSmoothNormals(normals);
    this.setSmoothUVs(uvs);
  }
}

class MeshTorus extends Mesh {
  constructor(radius?: number) {
    super(new TorusGeometry(radius));
  }
}

export default MeshTorus;