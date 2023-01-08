class Color {
  r: number;
  g: number;
  b: number;
  a: number;

  constructor(r = 0, g = 0, b = 0, a = 1.0) {
    this.r = r > 0 ? (r < 1.0 ? r : 1.0) : 0;
    this.g = g > 0 ? (g < 1.0 ? g : 1.0) : 0;
    this.b = b > 0 ? (b < 1.0 ? b : 1.0) : 0;
    this.a = a > 0 ? (a < 1.0 ? a : 1.0) : 0;
  }
}

export default Color;