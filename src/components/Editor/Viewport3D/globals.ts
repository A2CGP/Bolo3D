import WebGLRenderer from '@/renderers/WebGLRenderer';
import Scene from '@/scenes/Scene';
import Camera from '@/cameras/Camera';

export interface Viewport3DGlobals {
  canvas: HTMLCanvasElement;
  renderer: WebGLRenderer;
  scene: Scene;
  camera: Camera;
}

const globals: { current: Viewport3DGlobals | null } = { current: null };

export default globals;