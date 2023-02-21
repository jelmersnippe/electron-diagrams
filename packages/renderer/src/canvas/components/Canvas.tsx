import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import type Freehand from '../shapes/Freehand';
import type { ShapeType } from '../shapes/Freehand';
import { createShape } from '../shapes/Freehand';

export type CanvasRef = {
    context: CanvasRenderingContext2D | null;
}
interface Props {
    size: { width: number; height: number; };
    currentShapeType: ShapeType;
}
const Canvas = forwardRef<CanvasRef, Props>(({ size, currentShapeType }, ref) => {
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
    const canvas = useRef<HTMLCanvasElement>(null);
    const [currentShape, setCurrentShape] = useState<Freehand | null>(null);
    const [history, setHistory] = useState<Freehand[]>([]);

    useImperativeHandle(ref, () => ({
        context
    }));

    useEffect(() => {
        if (!canvas.current) {
            setContext(null);
            return;
        }

        setContext(canvas.current.getContext('2d'));
    }, [canvas.current]);

    const updateCurrentShape = () => {
        if (!canvas.current) {
            setCurrentShape(null);
            return;
        }

        setCurrentShape(createShape(currentShapeType, canvas.current));
    };

    useEffect(() => {
        updateCurrentShape();
    }, [currentShapeType, canvas.current]);

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
});

export default Canvas;
