import Camera from '../cameras/Camera';
import EventEmitter from 'events';
import Renderer from './Renderer';

abstract class SceneBase extends EventEmitter {
  renderer: Renderer;
  camera: Camera;

  constructor(renderer: Renderer, camera: Camera) {
    super();
    this.renderer = renderer;
    this.camera = camera;
  }

  abstract render(options?: any): void;
}

export default SceneBase;