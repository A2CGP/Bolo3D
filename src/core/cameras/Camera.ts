import { Matrix4 } from '@/math/Matrix';
import { Vector3 } from '@/math/Vector';
import { ObjectType } from '../classes/Object3D';
import SceneObject from '../classes/SceneObject';

export enum CameraType {
  Perspective,
  Orthographic,
}

abstract class Camera extends SceneObject {
  cameraType: CameraType;

  position = new Vector3(10.0, 6.0, 6.0);
  target = Vector3.zero();
  up = Vector3.unitY();

  direction = Vector3.unitZ().negate();

  viewMatrix = Matrix4.identity();
  projectionMatrix = Matrix4.identity();
  viewProjectionMatrixInverse = Matrix4.identity();

  constructor(type: CameraType) {
    super(ObjectType.Camera);
    this.cameraType = type;
    this.viewMatrix.lookAt(this.position, this.target, this.up);
  }

  setPosition(position: Vector3) {
    this.position = position;
    this.direction = Vector3.subtract(this.target, position).normalize();
    this.viewMatrix.lookAt(position, this.target, this.up);
  }

  setTarget(target: Vector3) {
    this.target = target;
    this.direction = Vector3.subtract(target, this.position).normalize();
    this.viewMatrix.lookAt(this.position, target, this.up);
  }

  rotateX(theta: number) {
    this.viewMatrix.rotateX(theta);
  }

  rotateY(theta: number) {
    this.viewMatrix.rotateY(theta);
  }

  rotateZ(theta: number) {
    this.viewMatrix.rotateZ(theta);
  }

  scale(factor: number) {
    this.position.multiplyScalar(factor);
    this.viewMatrix.lookAt(this.position, this.target, this.up);
  }
}

export default Camera;