import A2Camera, { A2CameraType } from './A2Camera';

class A2PerspectiveCamera extends A2Camera {
  fovy: number;
  aspect: number;
  near: number;
  far: number;

  constructor(fovy = Math.PI * 0.4, aspect = 1.0, near = 0.1, far = 1000.0) {
    super(A2CameraType.Perspective);
    this.fovy = fovy;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    this.projectionMatrix.perspective(fovy, aspect, near, far);
  }
}

export default A2PerspectiveCamera;