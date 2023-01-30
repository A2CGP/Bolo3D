import Object3D, { ObjectType } from '@/core/classes/Object3D';
import { PrimitiveMode } from '@/core/classes/Primitive';
import Mesh from '@/core/classes/Mesh';
import { Color3 } from '@/math/Color';

export enum ShadeMode {
  Flat,
  Smooth,
}

/**
 * 所有可以添加到Scene中的对象的基类
 */
abstract class SceneObject extends Object3D {
  displayName: string;
  primitiveMode = PrimitiveMode.TRIANGLES;
  shadeMode = ShadeMode.Flat;
  selected = false;
  color = new Color3(0.8, 0.8, 0.8);

  constructor(type: ObjectType) {
    super(type);
    this.displayName = `Object${this.objectId}`;
  }
}

export class SceneMesh extends SceneObject {
  public item: Mesh;

  constructor(mesh: Mesh) {
    super(ObjectType.Mesh);
    this.item = mesh;
    this.displayName = `Mesh${this.objectId}`;
  }
}

export default SceneObject;