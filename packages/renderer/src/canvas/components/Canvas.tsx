import { useRef, useState, useEffect } from 'react';
import type Freehand from '../shapes/Freehand';
import { createShape } from '../shapes/Freehand';
import type { ToolboxConfiguration } from './Toolbox';

export type CanvasRef = {
    context: CanvasRenderingContext2D | null;
}
interface Props {
    size: { width: number; height: number; };
    configuration: ToolboxConfiguration;
}
const Canvas = ({ size, configuration }: Props) => {
    const canvas = useRef<HTMLCanvasElement>(null);
    const [currentShape, setCurrentShape] = useState<Freehand | null>(null);
    const [history, setHistory] = useState<Freehand[]>([]);

    const updateCurrentShape = () => {
        if (currentShape?.drawing) {
            return;
        }
        if (!canvas.current) {
            setCurrentShape(null);
            return;
        }

        setCurrentShape(createShape(configuration.currentShapeType, canvas.current, configuration));
    };

    useEffect(() => {
        history.forEach((shape) => {
            shape.redo({ x: 0, y: 0 });
        });

    }, [size]);

    useEffect(() => {
        updateCurrentShape();
    }, [configuration, canvas.current]);

    const onMouseUpOrDown = (data: MouseEvent) => {
        if (!currentShape) {
            return;
        }

        // Left mouse button is 1 in the bitmap, so the value has to be uneven if left mouse button is pressed
        const leftMouseButtonDown = data.buttons % 2 !== 0;
        if (leftMouseButtonDown) {
            currentShape.init(data);
        } else if (currentShape.drawing) {
            currentShape.finish(data);
            setHistory([...history, currentShape]);
            updateCurrentShape();
        }
    };

    useEffect(() => {
        if (!canvas.current) {
            return;
        }
        canvas.current.addEventListener('mousedown', onMouseUpOrDown);
        canvas.current.addEventListener('mouseup', onMouseUpOrDown);

        return () => {
            if (!canvas.current) {
                return;
            }
            canvas.current.removeEventListener('mousedown', onMouseUpOrDown);
            canvas.current.removeEventListener('mouseup', onMouseUpOrDown);
        };
    }, [canvas.current, currentShape]);

    return (
        <div className='canvas-wrapper'>
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
