import type Camera from '@/core/cameras/Camera';
import { PrimitiveMode } from '@/core/classes/Primitive';
import { SceneMesh, ShadeMode } from '@/core/scene/SceneObject';
import { GLSLShader } from '@/core/shaders/Shader';
import BlinnPhong from '@/core/shaders/webgl/BlinnPhong';
import ColorOnly from '@/core/shaders/webgl/ColorOnly';
import Outline from '@/core/shaders/webgl/Outline';
import RenderingState from './RenderingState';

class MeshRenderingContext {
  private stateMap: Map<number, RenderingState> = new Map();
  private shaderMap: Map<object, GLSLShader> = new Map();

  constructor(private gl: WebGL2RenderingContext) {
    this.shaderMap.set(ColorOnly, new GLSLShader(gl, ColorOnly.vertex, ColorOnly.fragment));
    this.shaderMap.set(BlinnPhong, new GLSLShader(gl, BlinnPhong.vertex, BlinnPhong.fragment));
    this.shaderMap.set(Outline, new GLSLShader(gl, Outline.vertex, Outline.fragment));
  }

  private getState(sceneMesh: SceneMesh) {
    const gl = this.gl;
    const mesh = sceneMesh.item;
    let state = this.stateMap.get(sceneMesh.id);

    if (state) return state;

    if (sceneMesh.primitiveMode === PrimitiveMode.Lines) {
      state = new RenderingState(gl, this.shaderMap.get(ColorOnly) as GLSLShader);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, state.VBOs.get('index') || null);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.flatLineIndices, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, state.VBOs.get('position') || null);
      gl.bufferData(gl.ARRAY_BUFFER, mesh.geometry.flatVertices, gl.STATIC_DRAW);
    } else {
      state = new RenderingState(gl, this.shaderMap.get(BlinnPhong) as GLSLShader, true);
      if (sceneMesh.shadeMode === ShadeMode.Flat) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, state.VBOs.get('index') || null);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.flatIndices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, state.VBOs.get('position') || null);
        gl.bufferData(gl.ARRAY_BUFFER, mesh.geometry.flatVertices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, state.VBOs.get('normal') || null);
        gl.bufferData(gl.ARRAY_BUFFER, mesh.geometry.flatNormals, gl.STATIC_DRAW);
      } else {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, state.VBOs.get('index') || null);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.smoothIndices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, state.VBOs.get('position') || null);
        gl.bufferData(gl.ARRAY_BUFFER, mesh.geometry.smoothVertices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, state.VBOs.get('normal') || null);
        gl.bufferData(gl.ARRAY_BUFFER, mesh.geometry.smoothNormals, gl.STATIC_DRAW);
      }
    }
    this.stateMap.set(sceneMesh.id, state);

    return state;
  }

  public draw(sceneMesh: SceneMesh) {
    const gl = this.gl;
    const mesh = sceneMesh.item;

    if (sceneMesh.primitiveMode === PrimitiveMode.Lines) {
      gl.drawElements(gl.LINES, mesh.geometry.flatLineIndicesCount, gl.UNSIGNED_INT, 0);
    } else {
      if (sceneMesh.shadeMode === ShadeMode.Smooth) {
        gl.drawElements(gl.TRIANGLES, mesh.geometry.smoothIndicesCount, gl.UNSIGNED_INT, 0);
      } else {
        gl.drawElements(gl.TRIANGLES, mesh.geometry.flatIndicesCount, gl.UNSIGNED_INT, 0);
      }
    }
  }

  public render(sceneMesh: SceneMesh, camera: Camera) {
    const gl = this.gl;
    const state = this.getState(sceneMesh);
    const shader = state.shader;

    gl.bindVertexArray(state.VAO);
    if (sceneMesh.selected) {
      const outline = this.shaderMap.get(Outline) as GLSLShader;

      outline.use();
      outline.uniformMatrix4fv('uProjectionMatrix', camera.projectionMatrix.elements);
      outline.uniformMatrix4fv('uViewMatrix', camera.viewMatrix.elements);
      outline.uniformMatrix4fv('uModelMatrix', sceneMesh.modelMatrix.elements);
      gl.enable(gl.CULL_FACE);
      gl.cullFace(gl.FRONT);
      this.draw(sceneMesh);
      gl.disable(gl.CULL_FACE);
    }

    shader.use();
    shader.uniformMatrix4fv('uProjectionMatrix', camera.projectionMatrix.elements);
    shader.uniformMatrix4fv('uViewMatrix', camera.viewMatrix.elements);
    shader.uniformMatrix4fv('uModelMatrix', sceneMesh.modelMatrix.elements);
    shader.uniform3fv('uColor', sceneMesh.color.elements);
    shader.uniform3f('uEye', camera.position.x, camera.position.y, camera.position.z);
    this.draw(sceneMesh);
  }
}

export default MeshRenderingContext;