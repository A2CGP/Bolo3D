import Object3D, { ObjectType } from './Object3D';
import { PrimitiveMode } from './Primitive';

export enum ShadeMode {
  Flat,
  Smooth,
}

class A2DrawableObject extends Object3D {
  displayName: string;
  primitiveMode = PrimitiveMode.TRIANGLES;
  shadeMode = ShadeMode.Flat;
  selected = false;

  constructor(type = ObjectType.Mesh) {
    super(type);
    this.displayName = `Object${this.objectId}`;
  }
}

export default A2DrawableObject;