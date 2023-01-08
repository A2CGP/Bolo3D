import { useEffect, useRef } from 'react';
import ToolBar from '@/components/ToolBar';
import WebGLRenderer from '@/renderers/WebGLRenderer';
import Scene from '@/scenes/Scene';
import Camera from '@/cameras/Camera';
import PerspectiveCamera from '@/cameras/PerspectiveCamera';
import globals from './globals';
import { onInit } from './events';
import './index.less';

const Viewport3D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const current = globals.current;
      let renderer: WebGLRenderer;
      let scene: Scene;
      let camera: Camera;

      if (current) {
        renderer = current.renderer;
        scene = current.scene;
        camera = current.camera;
      } else {
        const canvas = canvasRef.current;
        const { width, height } = canvas.getBoundingClientRect();

        canvas.width = width * devicePixelRatio;
        canvas.height = height * devicePixelRatio;
        renderer = new WebGLRenderer(canvas);
        scene = new Scene();
        camera = new PerspectiveCamera(Math.PI * 0.4, width / height);
        globals.current = { canvas, renderer, scene, camera };
        onInit();
      }
      function render() {
        renderer.render(scene, camera);
        requestAnimationFrame(render);
      }
      render();
    }
  }, []);

  return (
    <div className='nuwa-editor-viewport3d'>
      <div className='nuwa-editor-viewport3d--toolbar-wrap'>
        <ToolBar />
      </div>
      <canvas ref={canvasRef} className='nuwa-editor-viewport3d--canvas'></canvas>
    </div>
  );
};

export default Viewport3D;