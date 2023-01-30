class RenderingState {
  program: WebGLProgram;
  locations: Record<string, WebGLUniformLocation | null> = {};
  VAO: WebGLVertexArrayObject;
  VBOs = new Map<string, WebGLBuffer>();

  constructor(gl: WebGL2RenderingContext, program: WebGLProgram, useNormal = false, useUV = false) {
    const VAO = gl.createVertexArray();

    if (!VAO) throw new Error('Create vertex array failed!');
    this.program = program;
    this.VAO = VAO;
    gl.bindVertexArray(VAO);
    this.createBuffer(gl, 'index', gl.ELEMENT_ARRAY_BUFFER);
    this.createArrayBuffer(gl, 'position', gl.getAttribLocation(program, 'position'), 3);
    if (useNormal) {
      this.createArrayBuffer(gl, 'normal', gl.getAttribLocation(program, 'normal'), 3);
      this.locations['uEye'] = gl.getUniformLocation(program, 'uEye');
    }
    if (useUV) this.createArrayBuffer(gl, 'uv', gl.getAttribLocation(program, 'uv'), 2);
    gl.bindVertexArray(null);
    this.locations['uProjectionMatrix'] = gl.getUniformLocation(program, 'uProjectionMatrix');
    this.locations['uViewMatrix'] = gl.getUniformLocation(program, 'uViewMatrix');
    this.locations['uModelMatrix'] = gl.getUniformLocation(program, 'uModelMatrix');
    this.locations['uColor'] = gl.getUniformLocation(program, 'uColor');
  }

  createBuffer(gl: WebGL2RenderingContext, name: string, target: number) {
    const buffer = gl.createBuffer();

    if (!buffer) {
      this.dispose(gl);
      throw new Error(`Failed to create VBO '${name}'!`);
    }
    gl.bindBuffer(target, buffer);
    this.VBOs.set(name, buffer);

    return buffer;
  }

  createArrayBuffer(gl: WebGL2RenderingContext, name: string, index: number, size: number) {
    const buffer = this.createBuffer(gl, name, gl.ARRAY_BUFFER);

    gl.vertexAttribPointer(index, size, gl.FLOAT, false, size * 4, 0);
    gl.enableVertexAttribArray(index);

    return buffer;
  }

  dispose(gl: WebGL2RenderingContext) {
    gl.deleteVertexArray(this.VAO);
    for (const VBO in this.VBOs.values) {
      gl.deleteBuffer(VBO);
    }
  }
}

export default RenderingState;