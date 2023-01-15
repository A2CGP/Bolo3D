import A2SceneBase from '../classes/A2SceneBase';
import A2WebGLRenderer from '../renderers/A2WebGLRenderer';

export interface A2IGlobalViewportEditorContext {
  scene: A2SceneBase;
}

export type A2TGlobalContext = {
  viewport: A2IGlobalViewportEditorContext | null;
};

const globalContext: A2TGlobalContext = {
  viewport: null,
};

abstract class A2GlobalContext {
  static readonly current = globalContext;
  static createRenderer(canvas: HTMLCanvasElement, options?: any) {
    return new A2WebGLRenderer(canvas, options);
  }
}

export default A2GlobalContext;