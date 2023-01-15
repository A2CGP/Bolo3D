export class Color3 {
  readonly elements: Float32List;

  constructor(r: number, g: number, b: number) {
    this.elements = new Float32Array([r, g, b]);
  }

  get r() {
    return this.elements[0];
  }

  set r(value: number) {
    this.elements[0] = value;
  }

  get g() {
    return this.elements[1];
  }

  set g(value: number) {
    this.elements[1] = value;
  }

  get b() {
    return this.elements[2];
  }

  set b(value: number) {
    this.elements[2] = value;
  }

  static black() {
    return new Color3(0, 0, 0);
  }

  static white() {
    return new Color3(1.0, 1.0, 1.0);
  }
}

export class Color4 {
  readonly elements: Float32List;

  constructor(r: number, g: number, b: number, a = 1.0) {
    this.elements = new Float32Array([r, g, b, a]);
  }

  get r() {
    return this.elements[0];
  }

  set r(value: number) {
    this.elements[0] = value;
  }

  get g() {
    return this.elements[1];
  }

  set g(value: number) {
    this.elements[1] = value;
  }

  get b() {
    return this.elements[2];
  }

  set b(value: number) {
    this.elements[2] = value;
  }

  get a() {
    return this.elements[3];
  }

  set a(value: number) {
    this.elements[3] = value;
  }

  static black() {
    return new Color4(0, 0, 0);
  }

  static white() {
    return new Color4(1.0, 1.0, 1.0);
  }
}