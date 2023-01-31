import { GLSLShader } from '@/core/shaders/Shader';

class RenderingState {
  public VAO: WebGLVertexArrayObject;
  public VBOs = new Map<string, WebGLBuffer>();

  constructor(private gl: WebGL2RenderingContext, public shader: GLSLShader, useNormal = false, useUV = false) {
    const VAO = gl.createVertexArray();

    if (!VAO) throw new Error('Create vertex array failed!');
    this.VAO = VAO;
    gl.bindVertexArray(VAO);
    this.createBuffer('index', gl.ELEMENT_ARRAY_BUFFER);
    this.createArrayBuffer('position', shader.getAttribLocation('position'), 3);
    if (useNormal) {
      this.createArrayBuffer('normal', shader.getAttribLocation('normal'), 3);
    }
    if (useUV) this.createArrayBuffer('uv', shader.getAttribLocation('uv'), 2);
    gl.bindVertexArray(null);
  }

  createBuffer(name: string, target: number) {
    const gl = this.gl;
    const buffer = gl.createBuffer();

    if (!buffer) {
      this.dispose();
      throw new Error(`Failed to create VBO '${name}'!`);
    }
    gl.bindBuffer(target, buffer);
    this.VBOs.set(name, buffer);

    return buffer;
  }

  createArrayBuffer(name: string, index: number, size: number) {
    const gl = this.gl;
    const buffer = this.createBuffer(name, gl.ARRAY_BUFFER);

    gl.vertexAttribPointer(index, size, gl.FLOAT, false, size * 4, 0);
    gl.enableVertexAttribArray(index);

    return buffer;
  }

  dispose() {
    const gl = this.gl;

    gl.deleteVertexArray(this.VAO);
    for (const VBO in this.VBOs.values) {
      gl.deleteBuffer(VBO);
    }
  }
}

export default RenderingState;