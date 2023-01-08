import Color from '@/numerics/Color';
import { Matrix4 } from '@/numerics/Matrix';
import { Vector3 } from '@/numerics/Vector';
import Object3D, { ObjectType } from './Object3D';

export enum MeshDrawMode {
  LINES,
  TRIANGLES,
}

class Mesh extends Object3D {
  drawMode = MeshDrawMode.TRIANGLES;
  indices = new Uint32Array();
  position = new Float32Array();
  normals = new Float32Array();
  uvs = new Float32Array();
  modelMatrix = Matrix4.identity();
  color = new Color(0.8, 0.8, 0.8);

  constructor() {
    super(ObjectType.Mesh);
  }
}

export class Grid extends Mesh {
  drawMode = MeshDrawMode.LINES;
  color = new Color(0.32, 0.32, 0.32);

  constructor(size = 100.0, gutter = 1.0) {
    super();
    const half = Math.round(size / 2.0);
    const indices = [];
    const position = [];
    let index = 0;

    for (let i = -half; i <= half; i += gutter) {
      position.push(i, 0, half, i, 0, -half);
      indices.push(index++, index++);
    }
    for (let i = -half; i <= half; i += gutter) {
      position.push(-half, 0, i, half, 0, i);
      indices.push(index++, index++);
    }
    this.indices = new Uint32Array(indices);
    this.position = new Float32Array(position);
  }
}

export class Cube extends Mesh {
  indices = new Uint32Array([
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
  position = new Float32Array([
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
  normals = new Float32Array([
    0, 0, 1.0, 0, 0, 1.0, 0, 0, 1.0, 0, 0, 1.0,
    0, 0, -1.0, 0, 0, -1.0, 0, 0, -1.0, 0, 0, -1.0,
    0, 1.0, 0, 0, 1.0, 0, 0, 1.0, 0, 0, 1.0, 0,
    0, -1.0, 0, 0, -1.0, 0, 0, -1.0, 0, 0, -1.0, 0,
    -1.0, 0, 0, -1.0, 0, 0, -1.0, 0, 0, -1.0, 0, 0,
    1.0, 0, 0, 1.0, 0, 0, 1.0, 0, 0, 1.0, 0, 0,
  ]);
}

export class Sphere extends Mesh {
  static MaxU = 16;
  static MaxV = 16;

  constructor(radius = 1.0) {
    super();
    const indices: number[] = [];
    const vertices: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = []
    const stackStep = Math.PI / Sphere.MaxV;
    const sectorStep = Math.PI * 2.0 / Sphere.MaxU;
    let phi = 0;
    let theta = 0;
    let x = 0;
    let y = 0;
    let z = 0;
    let xz = 0;

    for (let i = 0; i <= Sphere.MaxV; i++) {
      phi = i * stackStep - Math.PI / 2.0;
      y = Math.sin(phi);
      xz = Math.cos(phi);
      for (let j = 0; j <= Sphere.MaxU; j++) {
        theta = j * sectorStep;
        x = xz * Math.cos(theta);
        z = -xz * Math.sin(theta);
        vertices.push(x * radius, y * radius, z * radius);
        normals.push(x, y, z);
        uvs.push(j / Sphere.MaxU, i / Sphere.MaxV);
      }
    }
    for (let i = 0, k1, k2; i < Sphere.MaxV; i++) {
      k1 = i * (Sphere.MaxU + 1);
      k2 = k1 + Sphere.MaxU + 1;
      for (let j = 0; j < Sphere.MaxU; j++, k1++, k2++) {
        if (i != 0) indices.push(k1, k1 + 1, k2 + 1);
        if (i != (Sphere.MaxV - 1)) indices.push(k2 + 1, k2, k1);
      }
    }
    this.indices = new Uint32Array(indices);
    this.position = new Float32Array(vertices);
    this.normals = new Float32Array(normals);
    this.uvs = new Float32Array(uvs);
  }
}

export class Torus extends Mesh {
  static MaxU = 32;
  static MaxV = 16;

  constructor(radius = 1.0) {
    super();
    const inner = radius * 0.75;
    const outer = radius * 0.25;
    const indices: number[] = [];
    const vertices: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const stackStep = Math.PI * 2.0 / Torus.MaxV;
    const sectorStep = Math.PI * 2.0 / Torus.MaxU;
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

    for (let i = 0; i <= Torus.MaxU; i++) {
      phi = i * sectorStep;
      innerX = Math.cos(phi);
      innerZ = -Math.sin(phi);
      for (let j = 0; j <= Torus.MaxV; j++) {
        theta = j * stackStep;
        nx = Math.cos(theta) * innerX;
        ny = Math.sin(theta);
        nz = Math.cos(theta) * innerZ;
        x = inner * innerX + outer * nx;
        y = outer * ny;
        z = inner * innerZ + outer * nz;
        vertices.push(x, y, z);
        normals.push(nx, ny, nz);
        uvs.push(i / Torus.MaxU, j / Torus.MaxV);
      }
    }
    for (let i = 0, k1, k2; i < Torus.MaxU; i++) {
      k1 = i * (Torus.MaxV + 1);
      k2 = k1 + Torus.MaxV + 1;
      for (let j = 0; j < Torus.MaxV; j++, k1++, k2++) {
        indices.push(k1 + 1, k1, k2, k2, k2 + 1, k1 + 1);
      }
    }
    this.indices = new Uint32Array(indices);
    this.position = new Float32Array(vertices);
    this.normals = new Float32Array(normals);
    this.uvs = new Float32Array(uvs);
  }
}

export default Mesh;