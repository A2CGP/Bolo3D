import { A2ShadeMode } from '@/classes/A2DrawableObject';
import A2Geometry, { A2GeometryType } from '@/classes/A2Geometry';
import A2Mesh from '@/classes/A2Mesh';

class A2UVSphereGeometry extends A2Geometry {
  constructor(radius = 1.0, maxU = 16, maxV = 16) {
    super(A2GeometryType.UVSphere);
    const indices: number[] = [];
    const vertices: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = []
    const stackStep = Math.PI / maxV;
    const sectorStep = Math.PI * 2.0 / maxU;
    let phi = 0;
    let theta = 0;
    let x = 0;
    let y = 0;
    let z = 0;
    let xz = 0;

    for (let i = 0; i <= maxV; i++) {
      phi = i * stackStep - Math.PI / 2.0;
      y = Math.sin(phi);
      xz = Math.cos(phi);
      for (let j = 0; j <= maxU; j++) {
        theta = j * sectorStep;
        x = xz * Math.cos(theta);
        z = -xz * Math.sin(theta);
        vertices.push(x * radius, y * radius, z * radius);
        normals.push(x, y, z);
        uvs.push(j / maxU, i / maxV);
      }
    }
    for (let i = 0, k1, k2; i < maxV; i++) {
      k1 = i * (maxU + 1);
      k2 = k1 + maxU + 1;
      for (let j = 0; j < maxU; j++, k1++, k2++) {
        if (i != 0) indices.push(k1, k1 + 1, k2 + 1);
        if (i != (maxV - 1)) indices.push(k2 + 1, k2, k1);
      }
    }
    this.setSmoothIndices(indices);
    this.setSmoothVertices(vertices);
    this.setSmoothNormals(normals);
    this.setSmoothUVs(uvs);
  }
}

class A2MeshUVSphere extends A2Mesh {
  shadeMode = A2ShadeMode.Smooth;

  constructor(radius?: number) {
    super(new A2UVSphereGeometry(radius));
    this.displayName = `Sphere${this.objectId}`;
  }
}

export default A2MeshUVSphere;