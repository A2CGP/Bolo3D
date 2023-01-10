import A2Camera from '@/cameras/A2Camera';
import A2DrawableObject from '@/classes/A2DrawableObject';
import A2Mesh from '@/classes/A2Mesh';
import A2Renderer from '@/classes/A2Renderer';
import A2SceneBase from '@/classes/A2SceneBase';
import { Color3 } from '@/numerics/Color';
import A2Floor from '@/objects/A2Floor';
import A2MeshCube from '@/objects/meshes/A2MeshCube';
import A2MeshTorus from '@/objects/meshes/A2MeshTorus';
import A2MeshUVSphere from '@/objects/meshes/A2MeshUVSphere';

class A2Scene extends A2SceneBase {
  clearColor = new Color3(0.24, 0.24, 0.24);
  objectMaps = new Map<number, A2DrawableObject>();

  constructor(renderer: A2Renderer, camera: A2Camera) {
    super(renderer, camera);

    this.add(new A2Floor());
    this.add(new A2MeshCube());
    this.on('menu-add', (key: string) => {
      let item: A2Mesh | null = null;

      switch (key) {
        case 'Cube':
          item = new A2MeshCube();
          break;
        case 'UVSphere':
          item = new A2MeshUVSphere();
          break;
        case 'Torus':
          item = new A2MeshTorus();
          break;
      }
      if (item) {
        item.modelMatrix.translate(-Math.random() * 10.0, Math.random() * 5.0, -Math.random() * 10.0);
        this.add(item);
      }
    });
  }

  add(object: A2DrawableObject) {
    this.objectMaps.set(object.objectId, object);
    this.emit('add', object);
  }

  delete(object: A2DrawableObject) {
    this.objectMaps.delete(object.objectId);
    this.emit('delete', object);
  }

  render() {
    this.renderer.render(this, this.camera);
  }
}

export default A2Scene;