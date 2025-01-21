import { PointerEvent, useEffect, useRef, useState } from 'react';

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

const scalingFactor = 3;

function App() {
  const [points, setPoints] = useState<[number, number, number][]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handlePointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    if (e.target instanceof HTMLCanvasElement) {
      e.target.setPointerCapture(e.pointerId);
    }
    setPoints([[e.pageX * scalingFactor, e.pageY * scalingFactor, e.pressure]]);
  };

  const handlePointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (e.buttons !== 1) return;
    setPoints([
      ...points,
      [e.pageX * scalingFactor, e.pageY * scalingFactor, e.pressure],
    ]);
  };

  useEffect(() => {
    const stroke = getStroke(points, options);
    const pathData = getSvgPathFromStroke(stroke);
    const myPath = new Path2D(pathData);
    const ctx = canvasRef.current?.getContext('2d');

    ctx?.fill(myPath);
  });

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      width={800 * scalingFactor}
      height={800 * scalingFactor}
      style={{ touchAction: 'none', width: '800px', height: '800px' }}
    ></canvas>
  );
}

export default App;
