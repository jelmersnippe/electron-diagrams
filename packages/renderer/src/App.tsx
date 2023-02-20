import { useRef, useEffect, useState } from 'react';

const DEFAULT_BRUSH_SIZE = 12;

const App = () => {
    const [leftMouseDown, setLeftMouseDown] = useState<boolean>(false);
    const canvas = useRef<HTMLCanvasElement>(null);
    const [canvasSize, setCanvasSize] = useState<{ width: number, height: number }>({ width: 200, height: 200 });
    const [brushSize, setBrushSize] = useState<number>(DEFAULT_BRUSH_SIZE);
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
    let prevPoint: [number, number] | null = null;

    const onMouseMove = (data: MouseEvent) => {
        if (!context) {
            return;
        }

        const x = data.offsetX;
        const y = data.offsetY;
        if (prevPoint !== null) {
            context.lineWidth = brushSize;
            context.lineJoin = 'round';
            context.lineCap = 'round';
            context.strokeStyle = 'black';
            context.beginPath();
            context.moveTo(prevPoint[0], prevPoint[1]);
            context.lineTo(x, y);
            context.stroke();
        }

        prevPoint = [x, y];
        // context.fillStyle = 'rgb(255, 0, 0)';
        // context.fillRect(relativeX, relativeY, brushSize, brushSize);
    };

    const onMouseUpOrDown = (data: MouseEvent) => {
        // Left mouse button is 1 in the bitmap, so the value has to be uneven if left mouse button is pressed
        const leftMouseButtonDown = data.buttons % 2 !== 0;
        setLeftMouseDown(leftMouseButtonDown);
    };

    useEffect(() => {
        if (!canvas.current) {
            setContext(null);
            return;
        }

        const canvasBoundingBox = canvas.current.getBoundingClientRect();
        setCanvasSize({ width: canvasBoundingBox.width, height: canvasBoundingBox.height });
        setContext(canvas.current.getContext('2d'));
    }, [canvas.current]);

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
        <div className='container'>
            <div>
                <div>
                    <label>Brush size</label>
                    <input
                        min={1}
                        type={'number'}
                        defaultValue={brushSize}
                        onChange={(value) => {
                            const input = Number(value.target.value);
                            if (isNaN(input)) {
                                return;
                            }
                            setBrushSize(input);
                        }}
                    />
                </div>
            </div>
            <div className='canvas-wrapper'>
                <canvas
                    id="canvas"
                    ref={canvas}
                    width={canvasSize.width}
                    height={canvasSize.height}
                    onDrag={(data) => console.log(data)}
                />
            </div>
        </div>
    );
};

export default App;
