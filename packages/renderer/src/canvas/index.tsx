import { useEffect, useState, useRef } from 'react';
import type { CanvasRef } from './components/Canvas';
import Canvas from './components/Canvas';
import Toolbox from './components/Toolbox';

const Diagram = () => {
    const container = useRef<HTMLDivElement>(null);
    const [canvasSize, setCanvasSize] = useState<{ width: number, height: number }>({ width: 200, height: 200 });
    const [showToolbox, setShowToolbox] = useState<boolean>(false);
    const canvas = useRef<CanvasRef>(null);

    const resizeCanvas = () => {
        if (!container.current) {
            return;
        }

        const canvasBoundingBox = container.current.getBoundingClientRect();
        setCanvasSize({ width: canvasBoundingBox.width, height: canvasBoundingBox.height });
    };

    useEffect(() => {
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    useEffect(() => {
        setShowToolbox(!!canvas.current?.context);
    }, [canvas.current]);

    return (
        <div className='container' ref={container}>
            {showToolbox && canvas.current?.context && <Toolbox context={canvas.current.context} />}
            <Canvas size={canvasSize} ref={canvas} currentShapeType={'freehand'} />
        </div>
    );
};

export default Diagram;
