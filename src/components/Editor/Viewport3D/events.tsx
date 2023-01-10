import * as ReactDOM from 'react-dom';
import A2GlobalContext from '@/globals/A2GlobalContext';
import ContextMenu from '@/base-components/ContextMenu';

export const onInit = () => {
  const viewport = A2GlobalContext.current.viewport;

  if (!viewport) return;

  const container = document.getElementById('editor-contextmenu') as HTMLElement;
  const scene = viewport.scene;
  const canvas = scene.renderer.canvas;
  let isMouseDown = false;
  let lastX = 0;
  let lastY = 0;

  canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const hideContextMenu = () => ReactDOM.unmountComponentAtNode(container);
    container.style.position = 'absolute';
    container.style.left = `${e.offsetX}px`;
    container.style.top = `${e.offsetY}px`;
    container.style.zIndex = '8';
    ReactDOM.render(<ContextMenu onItemClick={hideContextMenu} />, container);
  });

  canvas.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    isMouseDown = true;
    lastX = e.x;
    lastY = e.y;
  });

  canvas.addEventListener('mouseup', (e) => {
    e.stopPropagation();
    isMouseDown = false;
    ReactDOM.unmountComponentAtNode(container);
  });

  canvas.addEventListener('mousemove', (e) => {
    e.stopPropagation();
    if (!isMouseDown) return;
    
    const moveX = e.x - lastX;
    const moveY = e.y - lastY;

    lastX = e.x;
    lastY = e.y;
    scene.camera.rotateY(moveX * Math.PI / 180);
    scene.camera.rotateX(moveY * Math.PI / 180);
  });

  canvas.addEventListener('mouseleave', (e) => {
    e.stopPropagation();
    isMouseDown = false;
  });

  canvas.addEventListener('wheel', (e) => {
    e.stopPropagation();
    // zoomIn
    if (e.deltaY < 0) {
      scene.camera.scale(0.98);
    } else { // zoomOut
      scene.camera.scale(1.02);
    }
  });
};