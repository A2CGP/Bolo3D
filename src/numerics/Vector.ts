export class Vector3 {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static zero() {
    return new Vector3(0, 0, 0);
  }

  static one() {
    return new Vector3(1.0, 1.0, 1.0);
  }

  static unitX() {
    return new Vector3(1.0, 0, 0);
  }

  static unitY() {
    return new Vector3(0, 1.0, 0);
  }

  static unitZ() {
    return new Vector3(0, 0, 1.0);
  }

  static negate(v: Vector3) {
    return new Vector3(-v.x, -v.y, -v.z);
  }

  negate() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }

  static normalize(v: Vector3) {
    let x = v.x;
    let y = v.y;
    let z = v.z;
    let L = Math.hypot(x, y, z);

    if (L > 0) L = 1 / L;
    x *= L;
    y *= L;
    z *= L;
    return new Vector3(x, y, z);
  }

  normalize() {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    let L = Math.hypot(x, y, z);

    if (L > 0) L = 1 / L;
    this.x *= L;
    this.y *= L;
    this.z *= L;
    return this;
  }

  length() {
    return Math.hypot(this.x, this.y, this.z);
  }

  distance(v: Vector3) {
    return Math.hypot(v.x - this.x, v.y - this.y, v.z - this.z);
  }

  dot(v: Vector3) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  static cross(v1: Vector3, v2: Vector3) {
    const x1 = v1.x;
    const y1 = v1.y;
    const z1 = v1.z;
    const x2 = v2.x;
    const y2 = v2.y;
    const z2 = v2.z;
    return new Vector3(y1 * z2 - z1 * y2, z1 * x2 - x1 * z2, x1 * y2 - y1 * x2);
  }

  cross(v: Vector3) {
    const x1 = this.x;
    const y1 = this.y;
    const z1 = this.z;
    const x2 = v.x;
    const y2 = v.y;
    const z2 = v.z;

    this.x = y1 * z2 - z1 * y2;
    this.y = z1 * x2 - x1 * z2;
    this.z = x1 * y2 - y1 * x2;
    return this;
  }

  static add(v1: Vector3, v2: Vector3) {
    return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
  }

  add(v: Vector3) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  static subtract(v1: Vector3, v2: Vector3) {
    return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
  }

  subtract(v: Vector3) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }

  static multiply(v1: Vector3, v2: Vector3) {
    return new Vector3(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z);
  }

  multiply(v: Vector3) {
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;
    return this;
  }

  static multiplyScalar(v: Vector3, scalar: number) {
    return new Vector3(v.x * scalar, v.y * scalar, v.z * scalar);
  }

  multiplyScalar(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }

  static divide(v1: Vector3, v2: Vector3) {
    return new Vector3(v1.x / v2.x, v1.y / v2.y, v1.z / v2.z);
  }

  divide(v: Vector3) {
    this.x /= v.x;
    this.y /= v.y;
    this.z /= v.z;
    return this;
  }
}