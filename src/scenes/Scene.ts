import Color from '@/numerics/Color';
import { Cube, Grid, Sphere, Torus } from '@/objects/Mesh';
import Object3D from '@/objects/Object3D';

class Scene {
  clearColor = new Color(0.24, 0.24, 0.24);
  objectMaps = new Map<number, Object3D>();

  constructor() {
    const sphere = new Sphere();
    const torus = new Torus();

    sphere.modelMatrix.translate(0, 0, -3.0);
    torus.modelMatrix.translate(0, 0, 3.0);
    this.add(new Grid());
    this.add(new Cube());
    this.add(sphere);
    this.add(torus);
  }

  add(object: Object3D) {
    this.objectMaps.set(object.objectId, object);
  }

  delete(object: Object3D) {
    this.objectMaps.delete(object.objectId);
  }
}

export default Scene;