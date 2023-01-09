export enum A2ObjectType {
  Mesh,
  Camera,
}

let objectId = 1;

abstract class A2Object {
  readonly objectId = objectId++;
  readonly objectType: A2ObjectType;

  constructor(type: A2ObjectType) {
    this.objectType = type;
  }
}

export default A2Object;