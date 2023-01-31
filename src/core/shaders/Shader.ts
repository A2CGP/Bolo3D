abstract class Shader { }

export class GLSLShader extends Shader {
  private program: WebGLProgram;
  private locations: Map<string, WebGLUniformLocation | null> = new Map();

  constructor(private gl: WebGL2RenderingContext, vertex: string, fragment: string) {
    super();
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertexShader) throw new Error('Failed to create vertex shader!');
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragmentShader) throw new Error('Failed to create fragment shader!');
    
    gl.shaderSource(vertexShader, vertex);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(vertexShader);
    gl.shaderSource(fragmentShader, fragment);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(fragmentShader);
    const program = gl.createProgram();
    if (!program) throw new Error('Failed to create shader program!');
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    this.program = program;
  }

  public use() {
    return this.gl.useProgram(this.program);
  }

  public getAttribLocation(name: string) {
    return this.gl.getAttribLocation(this.program, name);
  }

  public getUniformLocation(name: string) {
    let location = this.locations.get(name);

    if (!location) {
      location = this.gl.getUniformLocation(this.program, name);
      this.locations.set(name, location);
    }
    return location;
  }

  public uniform3f(name: string, x: number, y: number, z: number) {
    return this.gl.uniform3f(this.getUniformLocation(name), x, y, z);
  }

  public uniform3fv(name: string, data: Float32List) {
    return this.gl.uniform3fv(this.getUniformLocation(name), data);
  }

  public uniform4f(name: string, x: number, y: number, z: number, w: number) {
    return this.gl.uniform4f(this.getUniformLocation(name), x, y, z, w);
  }

  public uniformMatrix4fv(name: string, data: Float32List) {
    return this.gl.uniformMatrix4fv(this.getUniformLocation(name), false, data);
  }
}

export default Shader;