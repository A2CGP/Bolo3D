import type Scene from '@/core/scene/Scene';
import type Camera from '@/core/cameras/Camera';

abstract class Renderer {
  constructor(public canvas: HTMLCanvasElement) { }

  abstract render(scene: Scene, camera: Camera): void;
}

export default Renderer;