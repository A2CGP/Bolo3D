export enum A2GeometryType {
  Polygon,
  Plane,
  Cube,
  UVSphere,
  Torus,
}

let geometryId = 1;

class A2Geometry {
  readonly geometryId = geometryId++;
  readonly geometryType: A2GeometryType;

  indices: Uint32Array | null = null;
  countOfIndices = 0;
  vertices: Float32Array | null = null;
  countOfVertices = 0;
  faceNormals: Float32Array | null = null;
  vertexNormals: Float32Array | null = null;
  uvs: Float32Array | null = null;

  constructor(type: A2GeometryType) {
    this.geometryType = type;
  }
}

export default A2Geometry;