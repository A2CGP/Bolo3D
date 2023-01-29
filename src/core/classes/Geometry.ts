export enum GeometryType {
  Polygon,
  Plane,
  Cube,
  UVSphere,
  Torus,
}

let geometryId = 1;

abstract class Geometry {
  readonly geometryId = geometryId++;
  readonly geometryType: GeometryType;

  smoothLineIndices: Uint32Array | null = null;
  smoothLineIndicesCount = 0;
  smoothIndices: Uint32Array | null = null;
  smoothIndicesCount = 0;
  smoothVertices: Float32Array | null = null;
  smoothVerticesCount = 0;
  smoothNormals: Float32Array | null = null;
  smoothUVs: Float32Array | null = null;

  flatLineIndices: Uint32Array | null = null;
  flatLineIndicesCount = 0;
  flatIndices: Uint32Array | null = null;
  flatIndicesCount = 0;
  flatVertices: Float32Array | null = null;
  flatVerticesCount = 0;
  flatNormals: Float32Array | null = null;
  flatUVs: Float32Array | null = null;

  constructor(type: GeometryType) {
    this.geometryType = type;
  }

  setSmoothLineIndices(indices: Uint32List) {
    this.smoothLineIndices = new Uint32Array(indices);
    this.smoothLineIndicesCount = indices.length;
  }

  setSmoothIndices(indices: Uint32List) {
    this.smoothIndices = new Uint32Array(indices);
    this.smoothIndicesCount = indices.length;
  }

  setSmoothVertices(vertices: Float32List) {
    this.smoothVertices = new Float32Array(vertices);
    this.smoothVerticesCount = vertices.length;
  }

  setSmoothNormals(normals: Float32List) {
    this.smoothNormals = new Float32Array(normals);
  }

  setSmoothUVs(uvs: Float32List) {
    this.smoothUVs = new Float32Array(uvs);
  }

  setFlatLineIndices(indices: Uint32List) {
    this.flatLineIndices = new Uint32Array(indices);
    this.flatLineIndicesCount = indices.length;
  }

  setFlatIndices(indices: Uint32List) {
    this.flatIndices = new Uint32Array(indices);
    this.flatIndicesCount = indices.length;
  }

  setFlatVertices(vertices: Float32List) {
    this.flatVertices = new Float32Array(vertices);
    this.flatVerticesCount = vertices.length;
  }

  setFlatNormals(normals: Float32List) {
    this.flatNormals = new Float32Array(normals);
  }

  setFlatUVs(uvs: Float32List) {
    this.flatUVs = new Float32Array(uvs);
  }
}

export default Geometry;