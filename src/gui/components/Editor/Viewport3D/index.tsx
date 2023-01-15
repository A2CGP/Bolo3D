import { useEffect, useRef } from 'react';
import A2Renderer from '@/bolo3d/classes/A2Renderer';
import A2SceneBase from '@/bolo3d/classes/A2SceneBase';
import A2Scene from '@/bolo3d/scenes/A2Scene';
import A2Camera from '@/bolo3d/cameras/A2Camera';
import A2PerspectiveCamera from '@/bolo3d/cameras/A2PerspectiveCamera';
import A2GlobalContext from '@/bolo3d/globals/A2GlobalContext';
import Header from '../../Header';
import ToolBar from '../../ToolBar';
import { onInit } from './events';
import './index.less';

const Viewport3D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const current = A2GlobalContext.current.viewport;
      let renderer: A2Renderer;
      let scene: A2SceneBase;
      let camera: A2Camera;

      if (current) {
        scene = current.scene;
      } else {
        const canvas = canvasRef.current;
        const width = canvas.clientWidth * devicePixelRatio;
        const height = canvas.clientHeight * devicePixelRatio;

        canvas.width = width;
        canvas.height = height;
        renderer = A2GlobalContext.createRenderer(canvas);
        camera = new A2PerspectiveCamera(Math.PI * 0.4, width / height);
        scene = new A2Scene(renderer, camera);
        A2GlobalContext.current.viewport = { scene };
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
        <Header />
        <ToolBar />
      </div>
      <canvas ref={canvasRef} className='nuwa-editor-viewport3d--canvas'></canvas>
      <div id='editor-contextmenu'></div>
    </div>
  );
};

export default Viewport3D;