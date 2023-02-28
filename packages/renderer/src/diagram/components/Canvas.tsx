import { useEffect, useRef, useState } from 'react';
import Toolbox from '../components/Toolbox';
import DiagramState from './CanvasState';
import type { ToolboxConfiguration } from './Toolbox';

export type CanvasRef = {
  context: CanvasRenderingContext2D | null;
}
interface Props {
  size: { width: number; height: number; };
  configuration: ToolboxConfiguration;
}
const Canvas = ({ size}: Props) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [canvasState, setCanvasState] = useState<DiagramState | null>(null);

  useEffect(() => {
    canvasState?.draw();
  }, [size]);

  useEffect(() => {
    if (!canvas.current) {
      return;
    }

    setCanvasState(new DiagramState(canvas.current));
  }, [canvas.current]);

  return (
    <>
      {canvasState && <Toolbox diagramState={canvasState}/>}
      <div className='canvas-wrapper'>
        <button onClick={() => canvasState?.undo()}>Undo</button>
        <button onClick={() => canvasState?.redo()}>Redo</button>
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
