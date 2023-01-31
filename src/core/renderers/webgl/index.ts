import Camera from '@/core/cameras/Camera';
import Scene from '@/core/scene/Scene';
import Renderer from '@/core/renderers/Renderer';
import SceneObject, { SceneMesh, ShadeMode } from '@/core/scene/SceneObject';
import Picking from '@/core/shaders/webgl/Picking';
import RenderingState from './RenderingState';
import MeshRenderingContext from './MeshRenderingContext';
import { GLSLShader } from '@/core/shaders/Shader';

class WebGLRenderer extends Renderer {
  context: WebGL2RenderingContext;
  meshContext: MeshRenderingContext;

  pickingFBO: WebGLFramebuffer;
  pickingState: RenderingState;
  pickingColorTexture: WebGLTexture;
  pickingDepthTexture: WebGLTexture;
  pickingPosition = { x: 0, y: 0 };
  needsUpdatePicking = false;

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
    this.pickingState = new RenderingState(gl, new GLSLShader(gl, Picking.vertex, Picking.fragment));
    let texture = gl.createTexture();
    if (!texture) throw 'Failed to create texture!';
    this.pickingColorTexture = texture;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    texture = gl.createTexture();
    if (!texture) throw 'Failed to create texture!';
    this.pickingDepthTexture = texture;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT32F, width, height, 0, gl.DEPTH_COMPONENT, gl.FLOAT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, texture, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    this.meshContext = new MeshRenderingContext(gl);

    canvas.addEventListener('click', (e) => {
      this.pickingPosition.x = e.offsetX / canvas.clientWidth * width;
      this.pickingPosition.y = (1 - e.offsetY / canvas.clientHeight) * height;
      this.needsUpdatePicking = true;
    });
  }

  private selectedObjects: Set<SceneObject> = new Set();

  public render(scene: Scene, camera: Camera) {
    const gl = this.context;
    const { r, g, b } = scene.clearColor;

    if (this.needsUpdatePicking) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.pickingFBO);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      this.updatePicking(scene, camera);
      this.needsUpdatePicking = false;
      const data = new Uint8Array(4);
      gl.readPixels(this.pickingPosition.x, this.pickingPosition.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, data);
      const id = data[0] + (data[1] << 8) + (data[2] << 16) + (data[3] << 24);
      this.selectedObjects.forEach((object) => {
        object.selected = false;
      });
      this.selectedObjects.clear();
      if (id > 0) {
        scene.objectMap.forEach((object) => {
          if (object.id === id) {
            object.selected = true;
            this.selectedObjects.add(object);
          }
        });
      }
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.clearColor(r, g, b, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    scene.objectMap.forEach((sceneObject) => {
      if (sceneObject instanceof SceneMesh) {
        this.meshContext.render(sceneObject, camera);
      }
    });
  }

  private updatePicking(scene: Scene, camera: Camera) {
    const gl = this.context;
    const state = this.pickingState;
    const shader = state.shader;

    shader.use();
    gl.bindVertexArray(state.VAO);
    shader.uniformMatrix4fv('uProjectionMatrix', camera.projectionMatrix.elements);
    shader.uniformMatrix4fv('uViewMatrix', camera.viewMatrix.elements);
    scene.objectMap.forEach((object) => {
      if (!object.selectable) return;

      const id = object.id;

      shader.uniformMatrix4fv('uModelMatrix', object.modelMatrix.elements);
      shader.uniform4f('uColor', (id & 0xff) / 0xff, ((id >> 8) & 0xff) / 0xff, ((id >> 16) & 0xff) / 0xff, ((id >> 24) & 0xff) / 0xff);
      if (object instanceof SceneMesh) {
        const mesh = object.item;
        if (object.shadeMode === ShadeMode.Flat) {
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, state.VBOs.get('index') || null);
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.flatIndices, gl.STATIC_DRAW);
          gl.bindBuffer(gl.ARRAY_BUFFER, state.VBOs.get('position') || null);
          gl.bufferData(gl.ARRAY_BUFFER, mesh.geometry.flatVertices, gl.STATIC_DRAW);
        } else {
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, state.VBOs.get('index') || null);
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.smoothIndices, gl.STATIC_DRAW);
          gl.bindBuffer(gl.ARRAY_BUFFER, state.VBOs.get('position') || null);
          gl.bufferData(gl.ARRAY_BUFFER, mesh.geometry.smoothVertices, gl.STATIC_DRAW);
        }
        this.meshContext.draw(object);
      }
    });
  }
}

export default WebGLRenderer;