import { CameraType } from '@/core/types';
import Camera from './Camera';

class PerspectiveCamera extends Camera {
  fovy: number;
  aspect: number;
  near: number;
  far: number;

  constructor(fovy = Math.PI * 0.4, aspect = 1.0, near = 0.1, far = 1000.0) {
    super(CameraType.Perspective);
    this.fovy = fovy;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    this.projectionMatrix.perspective(fovy, aspect, near, far);
  }
}

export default PerspectiveCamera;