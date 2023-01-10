import A2Camera from '@/cameras/A2Camera';
import EventEmitter from 'events';
import A2Renderer from './A2Renderer';

abstract class A2SceneBase extends EventEmitter {
  renderer: A2Renderer;
  camera: A2Camera;

  constructor(renderer: A2Renderer, camera: A2Camera) {
    super();
    this.renderer = renderer;
    this.camera = camera;
  }

  abstract render(options?: any): void;
}

export default A2SceneBase;