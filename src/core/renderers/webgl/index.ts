import Camera from '@/core/cameras/Camera';
import Scene from '@/core/scene/Scene';
import { PrimitiveMode } from '@/core/classes/Primitive';
import Renderer from '@/core/classes/Renderer';
import SceneObject, { SceneMesh, ShadeMode } from '@/core/scene/SceneObject';
import { ObjectType } from '@/core/classes/Object3D';
import RenderingState from './RenderingState';
import BlinnPhong from '@/core/shaders/BlinnPhong';
import ColorOnly from '@/core/shaders/ColorOnly';
import Outline from '@/core/shaders/Outline';
import Picking from '@/core/shaders/Picking';
import Floor from '@/core/objects/Floor';

class WebGLRenderer extends Renderer {
  context: WebGL2RenderingContext;
  stateMap: Map<number, RenderingState> = new Map();
  pickingFBO: WebGLFramebuffer;
  pickingColorTexture: WebGLTexture;
  depthTexture: WebGLTexture;
  pickingProgram: WebGLProgram;
  pickingPosition = { x: 0, y: 0 };
  needsUpdatePicking = true;
  outlineProgram: WebGLProgram;

  constructor(canvas: HTMLCanvasElement, public options?: WebGLContextAttributes) {
    super(canvas);
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
    gl.enable(gl.DEPTH_TEST);
    this.context = gl;
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
    this.stateMap.set(0, new RenderingState(gl, this.pickingProgram));
    this.outlineProgram = this.createProgram(Outline.vertex, Outline.fragment);
    this.stateMap.set(-1, new RenderingState(gl, this.outlineProgram));

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

  selectedObjects: Set<SceneObject> = new Set();

  render(scene: Scene, camera: Camera) {
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
    scene.objectMaps.forEach((sceneObject: SceneObject) => {
      if (sceneObject.objectType === ObjectType.Mesh) {
        this.renderMesh(sceneObject as SceneMesh, scene, camera);
      }
    });
  }

  renderPicking(scene: Scene, camera: Camera) {
    const gl = this.context;
    const state = this.stateMap.get(0)!;

    gl.useProgram(this.pickingProgram);
    gl.bindVertexArray(state.VAO);
    gl.uniformMatrix4fv(state.locations['uProjectionMatrix'], false, camera.projectionMatrix.elements);
    gl.uniformMatrix4fv(state.locations['uViewMatrix'], false, camera.viewMatrix.elements);
    scene.objectMaps.forEach(object => {
      if (object.objectType === ObjectType.Mesh && !((object as SceneMesh).item instanceof Floor)) {
        const mesh = (object as SceneMesh).item;
        const id = object.objectId;

        gl.uniform4f(state.locations['uColor'], (id & 0xff) / 0xff, ((id >> 8) & 0xff) / 0xff, ((id >> 16) & 0xff) / 0xff, ((id >> 24) & 0xff) / 0xff);
        gl.uniformMatrix4fv(state.locations['uModelMatrix'], false, mesh.modelMatrix.elements);
        if (object.primitiveMode === PrimitiveMode.LINES) {
          if (object.shadeMode === ShadeMode.Smooth) {
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
          if (object.shadeMode === ShadeMode.Smooth) {
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

  private renderMesh(sceneMesh: SceneMesh, scene: Scene, camera: Camera) {
    const gl = this.context;
    const mesh = sceneMesh.item;
    let state = this.stateMap.get(sceneMesh.objectId);

    if (!state) {
      if (sceneMesh.primitiveMode === PrimitiveMode.LINES) {
        state = new RenderingState(gl, this.createProgram(ColorOnly.vertex, ColorOnly.fragment));
        gl.bindVertexArray(state.VAO);
      } else {
        state = new RenderingState(gl, this.createProgram(BlinnPhong.vertex, BlinnPhong.fragment), true);
        gl.bindVertexArray(state.VAO);
        gl.bindBuffer(gl.ARRAY_BUFFER, state.VBOs.get('normal') || null);
        if (sceneMesh.shadeMode === ShadeMode.Smooth) {
          gl.bufferData(gl.ARRAY_BUFFER, mesh.geometry.smoothNormals, gl.STATIC_DRAW);
        } else {
          gl.bufferData(gl.ARRAY_BUFFER, mesh.geometry.flatNormals, gl.STATIC_DRAW);
        }
      }
      this.stateMap.set(sceneMesh.objectId, state);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, state.VBOs.get('index') || null);
      if (sceneMesh.shadeMode === ShadeMode.Smooth) {
        if (sceneMesh.primitiveMode === PrimitiveMode.LINES) {
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.smoothLineIndices, gl.STATIC_DRAW);
        } else {
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.smoothIndices, gl.STATIC_DRAW);
        }
      } else {
        if (sceneMesh.primitiveMode === PrimitiveMode.LINES) {
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.flatLineIndices, gl.STATIC_DRAW);
        } else {
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.flatIndices, gl.STATIC_DRAW);
        }
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, state.VBOs.get('position') || null);
      if (sceneMesh.shadeMode === ShadeMode.Smooth) {
        gl.bufferData(gl.ARRAY_BUFFER, mesh.geometry.smoothVertices, gl.STATIC_DRAW);
      } else {
        gl.bufferData(gl.ARRAY_BUFFER, mesh.geometry.flatVertices, gl.STATIC_DRAW);
      }
    }
    if (sceneMesh.selected) {
      const ostate = this.stateMap.get(-1)!;
      gl.useProgram(this.outlineProgram);
      gl.uniformMatrix4fv(ostate.locations['uProjectionMatrix'], false, camera.projectionMatrix.elements);
      gl.uniformMatrix4fv(ostate.locations['uViewMatrix'], false, camera.viewMatrix.elements);
      gl.uniformMatrix4fv(ostate.locations['uModelMatrix'], false, mesh.modelMatrix.elements);
      gl.bindVertexArray(ostate.VAO);
      gl.enable(gl.CULL_FACE);
      gl.cullFace(gl.FRONT);
      if (sceneMesh.shadeMode === ShadeMode.Smooth) {
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
    gl.uniform3fv(state.locations['uColor'], sceneMesh.color.elements);
    gl.bindVertexArray(state.VAO);
    if (sceneMesh.primitiveMode === PrimitiveMode.LINES) {
      if (sceneMesh.shadeMode === ShadeMode.Smooth) {
        gl.drawElements(gl.LINES, mesh.geometry.smoothLineIndicesCount, gl.UNSIGNED_INT, 0);
      } else {
        gl.drawElements(gl.LINES, mesh.geometry.flatLineIndicesCount, gl.UNSIGNED_INT, 0);
      }
    } else {
      gl.uniform3f(state.locations['uEye'], camera.position.x, camera.position.y, camera.position.z);
      if (sceneMesh.shadeMode === ShadeMode.Smooth) {
        gl.drawElements(gl.TRIANGLES, mesh.geometry.smoothIndicesCount, gl.UNSIGNED_INT, 0);
      } else {
        gl.drawElements(gl.TRIANGLES, mesh.geometry.flatIndicesCount, gl.UNSIGNED_INT, 0);
      }
    }
  }
}

export default WebGLRenderer;