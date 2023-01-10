import A2Camera from '@/cameras/A2Camera';
import A2SceneBase from './A2SceneBase';

abstract class A2Renderer {
  abstract render(scene: A2SceneBase, camera: A2Camera): void;
}

export default A2Renderer;