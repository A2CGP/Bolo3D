export enum ObjectType {
  Mesh,
  Camera,
}

let objectId = 1;

abstract class Object3D {
  readonly objectId = objectId++;
  readonly objectType: ObjectType;

  constructor(type: ObjectType) {
    this.objectType = type;
  }
}

export default Object3D;