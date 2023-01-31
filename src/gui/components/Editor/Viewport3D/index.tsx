import { useEffect, useRef } from 'react';
import Renderer from '@/core/renderers/Renderer';
import Scene from '@/core/scene/Scene';
import Camera from '@/core/cameras/Camera';
import PerspectiveCamera from '@/core/cameras/PerspectiveCamera';
import GlobalContext from '@/core/GlobalContext';
import Header from '../../Header';
import ToolBar from '../../ToolBar';
import { onInit } from './events';
import './index.less';

const Viewport3D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const current = GlobalContext.current.viewport;
      let renderer: Renderer;
      let scene: Scene;
      let camera: Camera;

      if (current) {
        scene = current.scene;
      } else {
        const canvas = canvasRef.current;
        const width = canvas.clientWidth * devicePixelRatio;
        const height = canvas.clientHeight * devicePixelRatio;

        canvas.width = width;
        canvas.height = height;
        renderer = GlobalContext.createRenderer(canvas);
        camera = new PerspectiveCamera(Math.PI * 0.4, width / height);
        scene = new Scene();
        GlobalContext.current.viewport = { scene };
        onInit(canvas, scene, camera);
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
        <Header />
        <ToolBar />
      </div>
      <canvas ref={canvasRef} className='nuwa-editor-viewport3d--canvas'></canvas>
      <div id='editor-contextmenu'></div>
    </div>
  );
};

export default Viewport3D;