import A2Object, { A2ObjectType } from './A2Object';
import { A2PrimitiveMode } from './A2Primitive';

class A2DrawableObject extends A2Object {
  primitiveMode = A2PrimitiveMode.TRIANGLES;

  constructor(type = A2ObjectType.Mesh) {
    super(type);
  }
}

export default A2DrawableObject;