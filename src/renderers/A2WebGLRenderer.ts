import A2Camera from '@/cameras/A2Camera';
import A2Mesh from '@/classes/A2Mesh';
import { A2ObjectType } from '@/classes/A2Object';
import { A2PrimitiveMode } from '@/classes/A2Primitive';
import A2Scene from '@/scenes/A2Scene';
import BlinnPhong from '@/shaders/BlinnPhong';
import ColorOnly from '@/shaders/ColorOnly';

class State {
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

class WebGLRenderer {
  canvas: HTMLCanvasElement;
  context: WebGL2RenderingContext;
  states = new Map<number, State>();
  shaders = new Map();

  constructor(canvas: HTMLCanvasElement, options?: WebGLContextAttributes) {
    const context = canvas.getContext('webgl2', options);

    if (!context) throw new Error('Your current browser does not support WebGL2!');
    context.viewport(0, 0, canvas.width, canvas.height);
    this.canvas = canvas;
    this.context = context;
    context.enable(context.DEPTH_TEST);
    context.enable(context.BLEND);
    context.blendFunc(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA);
  }

  createProgram(vertex: string, fragment: string) {
    const gl = this.context;
    const program = gl.createProgram();
    if (!program) throw new Error('Failed to create shader program!');
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
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    return program;
  }

  render(scene: A2Scene, camera: A2Camera) {
    const gl = this.context;
    const { r, g, b } = scene.clearColor;

    gl.clearColor(r, g, b, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    scene.objectMaps.forEach(object => {
      if (object.objectType === A2ObjectType.Mesh) {
        this.renderMesh(object as A2Mesh, camera, scene);
      }
    });
  }

  renderMesh(mesh: A2Mesh, camera: A2Camera, scene: A2Scene) {
    const gl = this.context;
    let state = this.states.get(mesh.objectId);

    if (!state) {
      if (mesh.primitiveMode === A2PrimitiveMode.LINES) {
        state = new State(gl, this.createProgram(ColorOnly.vertex, ColorOnly.fragment));
        gl.bindVertexArray(state.VAO);
      } else {
        state = new State(gl, this.createProgram(BlinnPhong.vertex, BlinnPhong.fragment), true);
        gl.bindVertexArray(state.VAO);
        gl.bindBuffer(gl.ARRAY_BUFFER, state.VBOs.get('normal') || null);
        gl.bufferData(gl.ARRAY_BUFFER, mesh.geometry.vertexNormals, gl.STATIC_DRAW);
      }
      this.states.set(mesh.objectId, state);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, state.VBOs.get('index') || null);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.indices, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, state.VBOs.get('position') || null);
      gl.bufferData(gl.ARRAY_BUFFER, mesh.geometry.vertices, gl.STATIC_DRAW);
    }
    gl.useProgram(state.program);
    gl.uniformMatrix4fv(state.locations['uProjectionMatrix'], false, camera.projectionMatrix.elements);
    gl.uniformMatrix4fv(state.locations['uViewMatrix'], false, camera.viewMatrix.elements);
    gl.uniformMatrix4fv(state.locations['uModelMatrix'], false, mesh.modelMatrix.elements);
    gl.uniform3f(state.locations['uColor'], mesh.color.r, mesh.color.g, mesh.color.b);
    gl.bindVertexArray(state.VAO);
    if (mesh.primitiveMode === A2PrimitiveMode.LINES) {
      gl.drawElements(gl.LINES, mesh.geometry.countOfIndices, gl.UNSIGNED_INT, 0);
    } else {
      gl.uniform3f(state.locations['uEye'], camera.position.x, camera.position.y, camera.position.z);
      gl.drawElements(gl.TRIANGLES, mesh.geometry.countOfIndices, gl.UNSIGNED_INT, 0);
    }
  }
}

export default WebGLRenderer;