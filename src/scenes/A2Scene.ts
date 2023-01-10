import A2Camera from '@/cameras/A2Camera';
import A2DrawableObject from '@/classes/A2DrawableObject';
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

  private renderer: A2Renderer;
  private camera: A2Camera;

  constructor(renderer: A2Renderer, camera: A2Camera) {
    super();
    this.renderer = renderer;
    this.camera = camera;

    const sphere = new A2MeshUVSphere();
    const torus = new A2MeshTorus();

    sphere.modelMatrix.translate(0, 0, -3.0);
    torus.modelMatrix.translate(0, 0, 3.0);
    this.add(new A2Floor());
    this.add(new A2MeshCube());
    this.add(sphere);
    this.add(torus);
  }

  add(object: A2DrawableObject) {
    this.objectMaps.set(object.objectId, object);
  }

  delete(object: A2DrawableObject) {
    this.objectMaps.delete(object.objectId);
  }

  render() {
    this.renderer.render(this, this.camera);
  }
}

export default A2Scene;