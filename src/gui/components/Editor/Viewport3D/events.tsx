import * as ReactDOM from 'react-dom';
import ContextMenu from '@/components/ContextMenu';
import type Scene from '@/core/scene/Scene';
import type Camera from '@/core/cameras/Camera';

export const onInit = (canvas: HTMLCanvasElement, scene: Scene, camera: Camera) => {
  const container = document.getElementById('editor-contextmenu') as HTMLElement;
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
    camera.rotateY(moveX * Math.PI / 180);
    camera.rotateX(moveY * Math.PI / 180);
  });

  canvas.addEventListener('mouseleave', (e) => {
    e.stopPropagation();
    isMouseDown = false;
  });

  canvas.addEventListener('wheel', (e) => {
    e.stopPropagation();
    // zoomIn
    if (e.deltaY < 0) {
      camera.scale(0.98);
    } else { // zoomOut
      camera.scale(1.02);
    }
  });
};