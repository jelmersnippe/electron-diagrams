import { useEffect, useState, useRef } from 'react';
import type {CanvasRef} from './components/Canvas';
import Canvas from './components/Canvas';
import Toolbox from './components/Toolbox';

const Diagram = () => {
    const container = useRef<HTMLDivElement>(null);
    const [canvasSize, setCanvasSize] = useState<{ width: number, height: number }>({ width: 200, height: 200 });
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


    return (
        <div className='container' ref={container}>
            {canvas.current?.context && <Toolbox context={canvas.current.context}/>}
            <Canvas size={canvasSize} ref={canvas}/>
        </div>
    );
};

export default Diagram;
