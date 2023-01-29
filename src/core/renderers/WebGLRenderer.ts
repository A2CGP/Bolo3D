import A2Camera from '../cameras/Camera';
import A2DrawableObject, { ShadeMode } from '../classes/DrawableObject';
import A2Mesh from '../classes/Mesh';
import { ObjectType } from '../classes/Object3D';
import { PrimitiveMode } from '../classes/Primitive';
import A2Floor from '../objects/Floor';
import A2Scene from '../scenes/Scene';
import BlinnPhong from '../shaders/BlinnPhong';
import ColorOnly from '../shaders/ColorOnly';
import Outline from '../shaders/Outline';
import Picking from '../shaders/Picking';

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
  pickingFBO: WebGLFramebuffer;
  pickingColorTexture: WebGLTexture;
  depthTexture: WebGLTexture;
  pickingProgram: WebGLProgram;
  pickingPosition = { x: 0, y: 0 };
  needsUpdatePicking = true;
  outlineProgram: WebGLProgram;

  constructor(canvas: HTMLCanvasElement, options: WebGLContextAttributes = {}) {
    const { width, height } = canvas;
    const gl = canvas.getContext('webgl2', {
      powerPreference: "high-performance",
      antialias: true,
      depth: true,
      alpha: false,
      ...options,
    });

    if (!gl) throw new Error('Your current browser does not support WebGL2!');
    gl.viewport(0, 0, width, height);
    this.canvas = canvas;
    this.context = gl;
    gl.enable(gl.DEPTH_TEST);
    const fbo = gl.createFramebuffer();
    if (!fbo) throw 'Failed to create fbo!';
    this.pickingFBO = fbo;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    let texture = gl.createTexture();
    if (!texture) throw 'Failed to create texture!';
    this.pickingColorTexture = texture;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    texture = gl.createTexture();
    if (!texture) throw 'Failed to create texture!';
    this.depthTexture = texture;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT32F, width, height, 0, gl.DEPTH_COMPONENT, gl.FLOAT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, texture, 0);
    this.pickingProgram = this.createProgram(Picking.vertex, Picking.fragment);
    this.states.set(0, new State(gl, this.pickingProgram));
    this.outlineProgram = this.createProgram(Outline.vertex, Outline.fragment);
    this.states.set(-1, new State(gl, this.outlineProgram));

    canvas.addEventListener('click', (e) => {
      this.pickingPosition.x = e.offsetX / canvas.clientWidth * width;
      this.pickingPosition.y = (1 - e.offsetY / canvas.clientHeight) * height;
      this.needsUpdatePicking = true;
    });
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

  selectedObjects: Set<A2DrawableObject> = new Set();

  render(scene: A2Scene, camera: A2Camera) {
    const gl = this.context;
    const { r, g, b } = scene.clearColor;

    if (this.needsUpdatePicking) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.pickingFBO);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      this.renderPicking(scene, camera);
      this.needsUpdatePicking = false;
      const data = new Uint8Array(4);
      gl.readPixels(this.pickingPosition.x, this.pickingPosition.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, data);
      const id = data[0] + (data[1] << 8) + (data[2] << 16) + (data[3] << 24);
      this.selectedObjects.forEach((object) => {
        object.selected = false;
      });
      this.selectedObjects.clear();
      if (id > 0) {
        scene.objectMaps.forEach((object) => {
          if (object.objectId === id) {
            object.selected = true;
            this.selectedObjects.add(object);
          }
        });
      }
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.clearColor(r, g, b, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    scene.objectMaps.forEach(object => {
      if (object.objectType === ObjectType.Mesh) {
        this.renderMesh(object as A2Mesh, camera, scene);
      }
    });
  }

  renderPicking(scene: A2Scene, camera: A2Camera) {
    const gl = this.context;
    const state = this.states.get(0)!;

    gl.useProgram(this.pickingProgram);
    gl.bindVertexArray(state.VAO);
    gl.uniformMatrix4fv(state.locations['uProjectionMatrix'], false, camera.projectionMatrix.elements);
    gl.uniformMatrix4fv(state.locations['uViewMatrix'], false, camera.viewMatrix.elements);
    scene.objectMaps.forEach(object => {
      if (object.objectType === ObjectType.Mesh && !(object instanceof A2Floor)) {
        const mesh = object as A2Mesh;
        const id = mesh.objectId;

        gl.uniform4f(state.locations['uColor'], (id & 0xff) / 0xff, ((id >> 8) & 0xff) / 0xff, ((id >> 16) & 0xff) / 0xff, ((id >> 24) & 0xff) / 0xff);
        gl.uniformMatrix4fv(state.locations['uModelMatrix'], false, mesh.modelMatrix.elements);
        if (mesh.primitiveMode === PrimitiveMode.LINES) {
          if (mesh.shadeMode === ShadeMode.Smooth) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, state.VBOs.get('index') || null);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.smoothLineIndices, gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, state.VBOs.get('position') || null);
            gl.bufferData(gl.ARRAY_BUFFER, mesh.geometry.smoothVertices, gl.STATIC_DRAW);
            gl.drawElements(gl.LINES, mesh.geometry.smoothLineIndicesCount, gl.UNSIGNED_INT, 0);
          } else {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, state.VBOs.get('index') || null);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.flatLineIndices, gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, state.VBOs.get('position') || null);
            gl.bufferData(gl.ARRAY_BUFFER, mesh.geometry.flatVertices, gl.STATIC_DRAW);
            gl.drawElements(gl.LINES, mesh.geometry.flatLineIndicesCount, gl.UNSIGNED_INT, 0);
          }
        } else {
          if (mesh.shadeMode === ShadeMode.Smooth) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, state.VBOs.get('index') || null);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.smoothIndices, gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, state.VBOs.get('position') || null);
            gl.bufferData(gl.ARRAY_BUFFER, mesh.geometry.smoothVertices, gl.STATIC_DRAW);
            gl.drawElements(gl.TRIANGLES, mesh.geometry.smoothIndicesCount, gl.UNSIGNED_INT, 0);
          } else {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, state.VBOs.get('index') || null);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.flatIndices, gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, state.VBOs.get('position') || null);
            gl.bufferData(gl.ARRAY_BUFFER, mesh.geometry.flatVertices, gl.STATIC_DRAW);
            gl.drawElements(gl.TRIANGLES, mesh.geometry.flatIndicesCount, gl.UNSIGNED_INT, 0);
          }
        }
      }
    });
  }

  renderMesh(mesh: A2Mesh, camera: A2Camera, scene: A2Scene) {
    const gl = this.context;
    let state = this.states.get(mesh.objectId);

    if (!state) {
      if (mesh.primitiveMode === PrimitiveMode.LINES) {
        state = new State(gl, this.createProgram(ColorOnly.vertex, ColorOnly.fragment));
        gl.bindVertexArray(state.VAO);
      } else {
        state = new State(gl, this.createProgram(BlinnPhong.vertex, BlinnPhong.fragment), true);
        gl.bindVertexArray(state.VAO);
        gl.bindBuffer(gl.ARRAY_BUFFER, state.VBOs.get('normal') || null);
        if (mesh.shadeMode === ShadeMode.Smooth) {
          gl.bufferData(gl.ARRAY_BUFFER, mesh.geometry.smoothNormals, gl.STATIC_DRAW);
        } else {
          gl.bufferData(gl.ARRAY_BUFFER, mesh.geometry.flatNormals, gl.STATIC_DRAW);
        }
      }
      this.states.set(mesh.objectId, state);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, state.VBOs.get('index') || null);
      if (mesh.shadeMode === ShadeMode.Smooth) {
        if (mesh.primitiveMode === PrimitiveMode.LINES) {
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.smoothLineIndices, gl.STATIC_DRAW);
        } else {
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.smoothIndices, gl.STATIC_DRAW);
        }
      } else {
        if (mesh.primitiveMode === PrimitiveMode.LINES) {
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.flatLineIndices, gl.STATIC_DRAW);
        } else {
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.flatIndices, gl.STATIC_DRAW);
        }
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, state.VBOs.get('position') || null);
      if (mesh.shadeMode === ShadeMode.Smooth) {
        gl.bufferData(gl.ARRAY_BUFFER, mesh.geometry.smoothVertices, gl.STATIC_DRAW);
      } else {
        gl.bufferData(gl.ARRAY_BUFFER, mesh.geometry.flatVertices, gl.STATIC_DRAW);
      }
    }
    if (mesh.selected) {
      const ostate = this.states.get(-1)!;
      gl.useProgram(this.outlineProgram);
      gl.uniformMatrix4fv(ostate.locations['uProjectionMatrix'], false, camera.projectionMatrix.elements);
      gl.uniformMatrix4fv(ostate.locations['uViewMatrix'], false, camera.viewMatrix.elements);
      gl.uniformMatrix4fv(ostate.locations['uModelMatrix'], false, mesh.modelMatrix.elements);
      gl.bindVertexArray(ostate.VAO);
      gl.enable(gl.CULL_FACE);
      gl.cullFace(gl.FRONT);
      if (mesh.shadeMode === ShadeMode.Smooth) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ostate.VBOs.get('index') || null);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.smoothIndices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, ostate.VBOs.get('position') || null);
        gl.bufferData(gl.ARRAY_BUFFER, mesh.geometry.smoothVertices, gl.STATIC_DRAW);
        gl.drawElements(gl.TRIANGLES, mesh.geometry.smoothIndicesCount, gl.UNSIGNED_INT, 0);
      } else {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ostate.VBOs.get('index') || null);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.flatIndices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, ostate.VBOs.get('position') || null);
        gl.bufferData(gl.ARRAY_BUFFER, mesh.geometry.flatVertices, gl.STATIC_DRAW);
        gl.drawElements(gl.TRIANGLES, mesh.geometry.flatIndicesCount, gl.UNSIGNED_INT, 0);
      }
      gl.disable(gl.CULL_FACE);
    }
    gl.useProgram(state.program);
    gl.uniformMatrix4fv(state.locations['uProjectionMatrix'], false, camera.projectionMatrix.elements);
    gl.uniformMatrix4fv(state.locations['uViewMatrix'], false, camera.viewMatrix.elements);
    gl.uniformMatrix4fv(state.locations['uModelMatrix'], false, mesh.modelMatrix.elements);
    gl.uniform3fv(state.locations['uColor'], mesh.color.elements);
    gl.bindVertexArray(state.VAO);
    if (mesh.primitiveMode === PrimitiveMode.LINES) {
      if (mesh.shadeMode === ShadeMode.Smooth) {
        gl.drawElements(gl.LINES, mesh.geometry.smoothLineIndicesCount, gl.UNSIGNED_INT, 0);
      } else {
        gl.drawElements(gl.LINES, mesh.geometry.flatLineIndicesCount, gl.UNSIGNED_INT, 0);
      }
    } else {
      gl.uniform3f(state.locations['uEye'], camera.position.x, camera.position.y, camera.position.z);
      if (mesh.shadeMode === ShadeMode.Smooth) {
        gl.drawElements(gl.TRIANGLES, mesh.geometry.smoothIndicesCount, gl.UNSIGNED_INT, 0);
      } else {
        gl.drawElements(gl.TRIANGLES, mesh.geometry.flatIndicesCount, gl.UNSIGNED_INT, 0);
      }
    }
  }
}

export default WebGLRenderer;