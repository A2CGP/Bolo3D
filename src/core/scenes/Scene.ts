import Camera from '../cameras/Camera';
import DrawableObject from '../classes/DrawableObject';
import Mesh from '../classes/Mesh';
import Renderer from '../classes/Renderer';
import SceneBase from '../classes/SceneBase';
import { Color3 } from '../../math/Color';
import Floor from '../objects/Floor';
import MeshCube from '../objects/meshes/MeshCube';
import MeshTorus from '../objects/meshes/MeshTorus';
import MeshUVSphere from '../objects/meshes/MeshUVSphere';

class Scene extends SceneBase {
  clearColor = new Color3(0.24, 0.24, 0.24);
  objectMaps = new Map<number, DrawableObject>();

  constructor(renderer: Renderer, camera: Camera) {
    super(renderer, camera);

    this.add(new Floor());
    this.add(new MeshCube());
    this.on('menu-add', (key: string) => {
      let item: Mesh | null = null;

      switch (key) {
        case 'Cube':
          item = new MeshCube();
          break;
        case 'UVSphere':
          item = new MeshUVSphere();
          break;
        case 'Torus':
          item = new MeshTorus();
          break;
      }
      if (item) {
        item.modelMatrix.translate(-Math.random() * 10.0, Math.random() * 5.0, -Math.random() * 10.0);
        this.add(item);
      }
    });
  }

  add(object: DrawableObject) {
    this.objectMaps.set(object.objectId, object);
    this.emit('add', object);
  }

  delete(object: DrawableObject) {
    this.objectMaps.delete(object.objectId);
    this.emit('delete', object);
  }

  render() {
    this.renderer.render(this, this.camera);
  }
}

export default Scene;