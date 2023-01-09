import A2WebGLRenderer from '@/renderers/A2WebGLRenderer';
import A2Scene from '@/scenes/A2Scene';
import A2Camera from '@/cameras/A2Camera';

export interface Viewport3DGlobals {
  canvas: HTMLCanvasElement;
  renderer: A2WebGLRenderer;
  scene: A2Scene;
  camera: A2Camera;
}

const globals: { current: Viewport3DGlobals | null } = { current: null };

export default globals;