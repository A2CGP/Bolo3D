import { useEffect, useRef } from 'react';
import ToolBar from '@/components/ToolBar';
import A2WebGLRenderer from '@/renderers/A2WebGLRenderer';
import A2Scene from '@/scenes/A2Scene';
import A2Camera from '@/cameras/A2Camera';
import A2PerspectiveCamera from '@/cameras/A2PerspectiveCamera';
import globals from './globals';
import { onInit } from './events';
import './index.less';

const Viewport3D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const current = globals.current;
      let renderer: A2WebGLRenderer;
      let scene: A2Scene;
      let camera: A2Camera;

      if (current) {
        renderer = current.renderer;
        scene = current.scene;
        camera = current.camera;
      } else {
        const canvas = canvasRef.current;
        const width = canvas.clientWidth * devicePixelRatio;
        const height = canvas.clientHeight * devicePixelRatio;

        canvas.width = width;
        canvas.height = height;
        renderer = new A2WebGLRenderer(canvas);
        camera = new A2PerspectiveCamera(Math.PI * 0.4, width / height);
        scene = new A2Scene(renderer, camera);
        globals.current = { canvas, renderer, scene, camera };
        onInit();
      }
      function render() {
        scene.render();
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