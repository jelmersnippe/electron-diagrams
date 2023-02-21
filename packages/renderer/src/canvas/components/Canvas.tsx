import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';

export type CanvasRef = {
    context: CanvasRenderingContext2D | null;
}
interface Props {
    size: { width: number; height: number; };
}
const Canvas = forwardRef<CanvasRef, Props>(({ size }, ref) => {
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
    const [leftMouseDown, setLeftMouseDown] = useState<boolean>(false);
    const canvas = useRef<HTMLCanvasElement>(null);
    let prevPoint: [number, number] | null = null;

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

    const onMouseMove = (data: MouseEvent) => {
        if (!context) {
            return;
        }

        const { x, y } = data;
        if (prevPoint !== null) {
            context.lineJoin = 'round';
            context.lineCap = 'round';
            context.strokeStyle = 'black';
            context.beginPath();
            context.moveTo(prevPoint[0], prevPoint[1]);
            context.lineTo(x, y);
            context.stroke();
        }

        prevPoint = [x, y];
    };

    const onMouseUpOrDown = (data: MouseEvent) => {
        // Left mouse button is 1 in the bitmap, so the value has to be uneven if left mouse button is pressed
        const leftMouseButtonDown = data.buttons % 2 !== 0;
        setLeftMouseDown(leftMouseButtonDown);
    };

    useEffect(() => {
        if (!context || !leftMouseDown || !canvas.current) {
            return;
        }
        canvas.current.style.cursor = 'crosshair';
        canvas.current.addEventListener('mousemove', onMouseMove);

        return () => {
            if (!canvas.current) {
                return;
            }
            document.body.style.cursor = 'default';
            canvas.current?.removeEventListener('mousemove', onMouseMove);
            prevPoint = null;
        };
    }, [leftMouseDown]);

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
    }, [canvas.current]);

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
