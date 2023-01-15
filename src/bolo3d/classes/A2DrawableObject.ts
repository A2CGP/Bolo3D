import A2Object, { A2ObjectType } from './A2Object';
import { A2PrimitiveMode } from './A2Primitive';

export enum A2ShadeMode {
  Flat,
  Smooth,
}

class A2DrawableObject extends A2Object {
  displayName: string;
  primitiveMode = A2PrimitiveMode.TRIANGLES;
  shadeMode = A2ShadeMode.Flat;
  selected = false;

  constructor(type = A2ObjectType.Mesh) {
    super(type);
    this.displayName = `Object${this.objectId}`;
  }
}

export default A2DrawableObject;