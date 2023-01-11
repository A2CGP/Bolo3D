import { useEffect, useRef } from 'react';
import Header from '@/components/Header';
import A2Renderer from '@/classes/A2Renderer';
import A2SceneBase from '@/classes/A2SceneBase';
import A2Scene from '@/scenes/A2Scene';
import A2Camera from '@/cameras/A2Camera';
import A2PerspectiveCamera from '@/cameras/A2PerspectiveCamera';
import A2GlobalContext from '@/globals/A2GlobalContext';
import { onInit } from './events';
import './index.less';
import ToolBar from '@/components/ToolBar';

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