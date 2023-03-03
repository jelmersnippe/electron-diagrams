import { useEffect, useRef, useState } from 'react';
import Toolbox from '../components/Toolbox';
import DiagramState from './CanvasState';

export type CanvasRef = {
  context: CanvasRenderingContext2D | null;
}
interface Props {
  size: { width: number; height: number; };
}
const Canvas = ({ size }: Props) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [canvasState, setCanvasState] = useState<DiagramState | null>(null);

  useEffect(() => {
    canvasState?.draw();
  }, [size]);

  useEffect(() => {
    if (!canvas.current) {
      return;
    }

    const newCanvasState = new DiagramState(canvas.current);
    setCanvasState(newCanvasState);

    return () => {
      newCanvasState.deregister();
    };
  }, [canvas.current]);

  return (
    <>
      {canvasState && <Toolbox diagramState={canvasState} />}
      <div className='canvas-wrapper'>
        <canvas
          id="canvas"
          width={size.width}
          height={size.height}
          ref={canvas}
        />
      </div>
    </>
  );
};

export default Canvas;
