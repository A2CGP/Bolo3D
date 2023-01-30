import EventEmitter from 'events';
import SceneObject, { SceneMesh, ShadeMode } from './SceneObject';
import Mesh from '@/core/classes/Mesh';
import { Color3 } from '@/math/Color';
import Floor from '@/core/objects/Floor';
import MeshCube from '@/core/objects/meshes/MeshCube';
import MeshTorus from '@/core/objects/meshes/MeshTorus';
import MeshUVSphere from '@/core/objects/meshes/MeshUVSphere';
import { PrimitiveMode } from '../classes/Primitive';

class Scene extends EventEmitter {
  public clearColor = new Color3(0.24, 0.24, 0.24);
  public objectMaps = new Map<number, SceneObject>();

  constructor() {
    super();
    const floor = new SceneMesh(new Floor());
    floor.primitiveMode = PrimitiveMode.LINES;
    floor.color = new Color3(0.32, 0.32, 0.32);
    this.add(floor);
    this.add(new SceneMesh(new MeshCube()));
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
        const mesh = new SceneMesh(item);
        if (key !== 'Cube') {
          mesh.shadeMode = ShadeMode.Smooth;
        }
        this.add(mesh);
      }
    });
  }

  add(object: SceneObject) {
    this.objectMaps.set(object.objectId, object);
    this.emit('add', object);
  }

  delete(object: SceneObject) {
    this.objectMaps.delete(object.objectId);
    this.emit('delete', object);
  }
}

export default Scene;