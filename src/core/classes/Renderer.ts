import Camera from '../cameras/Camera';
import SceneBase from './SceneBase';

abstract class A2Renderer {
  readonly canvas: HTMLCanvasElement;
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  abstract render(scene: SceneBase, camera: Camera): void;
}

export default A2Renderer;