import SceneBase from './classes/SceneBase';
import WebGLRenderer from './renderers/WebGLRenderer';

export interface IGlobalViewportEditorContext {
  scene: SceneBase;
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