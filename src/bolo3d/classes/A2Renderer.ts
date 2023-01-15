import A2Camera from '../cameras/A2Camera';
import A2SceneBase from './A2SceneBase';

abstract class A2Renderer {
  readonly canvas: HTMLCanvasElement;
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  abstract render(scene: A2SceneBase, camera: A2Camera): void;
}

export default A2Renderer;