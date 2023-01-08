import globals from './globals';

export const onInit = () => {
  if (!globals.current) return;

  const { canvas, camera } = globals.current;
  let isMouseDown = false;
  let lastX = 0;
  let lastY = 0;

  canvas.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    isMouseDown = true;
    lastX = e.x;
    lastY = e.y;
  });

  canvas.addEventListener('mouseup', (e) => {
    e.stopPropagation();
    isMouseDown = false;
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