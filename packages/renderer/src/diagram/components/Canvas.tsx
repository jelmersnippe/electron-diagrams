import { useRef, useState, useEffect } from 'react';
import type Shape from '../shapes/Shape';
import { createShape } from '../shapes/Freehand';
import type { ToolboxConfiguration } from './Toolbox';
import CanvasState from './CanvasState';

export type CanvasRef = {
    context: CanvasRenderingContext2D | null;
}
interface Props {
    size: { width: number; height: number; };
    configuration: ToolboxConfiguration;
}
const Canvas = ({ size, configuration }: Props) => {
    const canvas = useRef<HTMLCanvasElement>(null);
    const [currentShape, setCurrentShape] = useState<Shape | null>(null);
    const [canvasState, setCanvasState] = useState<CanvasState | null>(null);

    const updateCurrentShape = () => {
        if (!canvasState) {
            setCurrentShape(null);
            return;
        }

        setCurrentShape(createShape(configuration.currentShapeType, canvasState, configuration));
    };

    useEffect(() => {
        console.log(canvasState);
        canvasState?.draw();
    }, [size]);

    useEffect(() => {
        updateCurrentShape();
    }, [configuration, canvasState]);

    const onMouseUpOrDown = (data: MouseEvent) => {
        if (!currentShape) {
            return;
        }

        // Left mouse button is 1 in the bitmap, so the value has to be uneven if left mouse button is pressed
        const leftMouseButtonDown = data.buttons % 2 !== 0;
        if (leftMouseButtonDown) {
            currentShape.start(data);
        } else if (currentShape.drawing) {
            const command = currentShape.finish(data);
            canvasState?.executeCommand(command);
            updateCurrentShape();
        }
    };

    useEffect(() => {
        if (!canvas.current) {
            return;
        }
        canvas.current.addEventListener('mousedown', onMouseUpOrDown);
        canvas.current.addEventListener('mouseleave', onMouseUpOrDown);
        canvas.current.addEventListener('mouseup', onMouseUpOrDown);

        return () => {
            if (!canvas.current) {
                return;
            }
            canvas.current.removeEventListener('mousedown', onMouseUpOrDown);
            canvas.current.removeEventListener('mouseleave', onMouseUpOrDown);
            canvas.current.removeEventListener('mouseup', onMouseUpOrDown);
        };
    }, [canvas.current, currentShape]);

    useEffect(() => {
        if (!canvas.current) {
            return;
        }

        setCanvasState(new CanvasState(canvas.current));
    }, [canvas.current]);

    return (
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
    );
};

export default Canvas;
