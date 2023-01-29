import type Scene from './classes/Scene';
import WebGLRenderer from './renderers/WebGLRenderer';

export interface IGlobalViewportEditorContext {
  scene: Scene;
}

export interface IGlobalContext {
  viewport: IGlobalViewportEditorContext | null;
}

const globalContext: IGlobalContext = {
  viewport: null,
};

abstract class GlobalContext {
  public static readonly current = globalContext;

  public static createRenderer(canvas: HTMLCanvasElement, options?: any) {
    return new WebGLRenderer(canvas, options);
  }
}

export default GlobalContext;