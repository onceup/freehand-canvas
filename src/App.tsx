import { useEffect, useRef, useState } from 'react';

import getStroke from 'perfect-freehand';
import { getSvgPathFromStroke } from './utils';

const options = {
  size: 32,
  thinning: 0.5,
  smoothing: 0.5,
  streamline: 0.5,
  easing: (t: number) => t,
  start: {
    taper: 0,
    easing: (t: number) => t,
    cap: true,
  },
  end: {
    taper: 100,
    easing: (t: number) => t,
    cap: true,
  },
};

const dpi = 3;

function App() {
  const [points, setPoints] = useState<[number, number, number][]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setPoints([[e.pageX * dpi, e.pageY * dpi, e.pressure]]);
  }

  function handlePointerMove(e) {
    if (e.buttons !== 1) return;
    setPoints([...points, [e.pageX * dpi, e.pageY * dpi, e.pressure]]);
  }

  const stroke = getStroke(points, options);
  const pathData = getSvgPathFromStroke(stroke);
  const myPath = new Path2D(pathData);
  const ctx = canvasRef.current?.getContext('2d');

  ctx?.fill(myPath);
  // useEffect(() => {
  //   const myPath = new Path2D(pathData);
  //   console.log('mypath', myPath);
  //   if (canvasRef.current) {
  //     canvasRef.current.fill(myPath);
  //   }
  // }, [pathData]);

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      width={800 * dpi}
      height={800 * dpi}
      style={{ touchAction: 'none', width: '800px', height: '800px' }}
    ></canvas>
  );
}

export default App;
