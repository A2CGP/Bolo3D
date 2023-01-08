import { Vector3 } from './Vector';

export class Matrix4 {
  elements: Float32List;

  constructor(elements: Float32List) {
    this.elements = elements.slice(0, 16);
    this.elements.fill(0, elements.length);
  }

  static identity() {
    return new Matrix4([1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0]);
  }

  identity() {
    const te = this.elements;
    te[0] = te[5] = te[10] = te[15] = 1.0;
    te[1] = te[2] = te[3] = te[4] = te[6] = te[7] = te[8] = te[9] = te[11] = te[12] = te[13] = te[14] = 0;
    return this;
  }

  lookAt(eye: Vector3, target: Vector3, up: Vector3) {
    const te = this.elements;
    const zAxis = Vector3.subtract(eye, target).normalize();
    const xAxis = Vector3.cross(up, zAxis).normalize();
    const yAxis = Vector3.cross(zAxis, xAxis);
    const ex = -eye.dot(xAxis);
    const ey = -eye.dot(yAxis);
    const ez = -eye.dot(zAxis);

    te[0] = xAxis.x;
    te[1] = yAxis.x;
    te[2] = zAxis.x;
    te[4] = xAxis.y;
    te[5] = yAxis.y;
    te[6] = zAxis.y;
    te[8] = xAxis.z;
    te[9] = yAxis.z;
    te[10] = zAxis.z;
    te[12] = ex;
    te[13] = ey;
    te[14] = ez;
    te[15] = 1.0;
    te[3] = te[7] = te[11] = 0;
    return this;
  }

  perspective(fovy: number, aspect: number, near: number, far: number) {
    const te = this.elements;
    const f = 1.0 / Math.tan(fovy / 2.0);
    const z = 1.0 / (near - far);

    te[0] = f / aspect;
    te[5] = f;
    te[10] = (near + far) * z;
    te[11] = -1.0;
    te[14] = 2.0 * near * far * z;
    te[1] = te[2] = te[3] = te[4] = te[6] = te[7] = te[8] = te[9] = te[12] = te[13] = te[15] = 0;
    return this;
  }

  static multiply(m1: Matrix4, m2: Matrix4) {
    const [a11, a21, a31, a41, a12, a22, a32, a42, a13, a23, a33, a43, a14, a24, a34, a44] = m1.elements;
    const [b11, b21, b31, b41, b12, b22, b32, b42, b13, b23, b33, b43, b14, b24, b34, b44] = m2.elements;
    const m11 = a11 * b11;
    const m12 = a21 * b12;
    const m13 = a31 * b13;
    const m14 = a41 * b14;
    const m21 = a12 * b21;
    const m22 = a22 * b22;
    const m23 = a32 * b23;
    const m24 = a42 * b24;
    const m31 = a13 * b31;
    const m32 = a23 * b32;
    const m33 = a33 * b33;
    const m34 = a43 * b34;
    const m41 = a14 * b41;
    const m42 = a24 * b42;
    const m43 = a34 * b43;
    const m44 = a44 * b44;
    return new Matrix4([m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44]);
  }

  multiply(m: Matrix4) {
    const te = this.elements;
    const [m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44] = te;
    const [n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44] = m.elements;

    te[0] = m11 * n11;
    te[1] = m21 * n12;
    te[2] = m31 * n13;
    te[3] = m41 * n14;
    te[4] = m12 * n21;
    te[5] = m22 * n22;
    te[6] = m32 * n23;
    te[7] = m42 * n24;
    te[8] = m13 * n31;
    te[9] = m23 * n32;
    te[10] = m33 * n33;
    te[11] = m43 * n34;
    te[12] = m14 * n41;
    te[13] = m24 * n42;
    te[14] = m34 * n43;
    te[15] = m44 * n44;
    return this;
  }

  translate(x: number, y: number, z: number) {
    const te = this.elements;
    te[12] += x;
    te[13] += y;
    te[14] += z;
    return this;
  }

  scale1f(factor: number) {
    const te = this.elements;
    te[0] *= factor;
    te[5] *= factor;
    te[10] *= factor;
    return this;
  }

  scale3f(x: number, y: number, z: number) {
    const te = this.elements;
    te[0] *= x;
    te[5] *= y;
    te[10] *= z;
    return this;
  }

  rotateX(theta: number) {
    const te = this.elements;
    const ry = Math.cos(theta);
    const rz = Math.sin(theta);
    const m21 = te[4];
    const m22 = te[5];
    const m23 = te[6];
    const m24 = te[7];
    const m31 = te[8];
    const m32 = te[9];
    const m33 = te[10];
    const m34 = te[11];

    te[4] = m21 * ry + m31 * rz;
    te[5] = m22 * ry + m32 * rz;
    te[6] = m23 * ry + m33 * rz;
    te[7] = m24 * ry + m34 * rz;
    te[8] = m31 * ry - m21 * rz;
    te[9] = m32 * ry - m22 * rz;
    te[10] = m33 * ry - m23 * rz;
    te[11] = m34 * ry - m24 * rz;
    return this;
  }

  rotateY(theta: number) {
    const te = this.elements;
    const rx = Math.sin(theta);
    const rz = Math.cos(theta);
    const m11 = te[0];
    const m12 = te[1];
    const m13 = te[2];
    const m14 = te[3];
    const m31 = te[8];
    const m32 = te[9];
    const m33 = te[10];
    const m34 = te[11];

    te[0] = m11 * rz - m31 * rx;
    te[1] = m12 * rz - m32 * rx;
    te[2] = m13 * rz - m33 * rx;
    te[3] = m14 * rz - m34 * rx;
    te[8] = m11 * rx + m31 * rz;
    te[9] = m12 * rx + m32 * rz;
    te[10] = m13 * rx + m33 * rz;
    te[11] = m14 * rx + m34 * rz;
    return this;
  }

  rotateZ(theta: number) {
    const te = this.elements;
    const rx = Math.cos(theta);
    const ry = Math.sin(theta);
    const m11 = te[0];
    const m12 = te[1];
    const m13 = te[2];
    const m14 = te[3];
    const m21 = te[4];
    const m22 = te[5];
    const m23 = te[6];
    const m24 = te[7];

    te[0] = m11 * ry - m21 * rx;
    te[1] = m12 * ry - m22 * rx;
    te[2] = m13 * ry - m23 * rx;
    te[3] = m14 * ry - m24 * rx;
    te[4] = m11 * rx + m21 * ry;
    te[5] = m12 * rx + m22 * ry;
    te[6] = m13 * rx + m23 * ry;
    te[7] = m14 * rx + m24 * ry;
    return this;
  }
}