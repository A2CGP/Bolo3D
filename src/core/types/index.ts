export type Nullable<T> = T | null;

export interface IRenderer { }

export const enum RendererType {
  WebGL = 'webgl2',
  WebGPU = 'webgpu',
}

export interface ICamera { }

export const enum CameraType {
  Perspective,
  Orthographic,
}