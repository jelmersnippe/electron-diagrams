import { useEffect, useRef, useState } from 'react';
import Canvas from './components/Canvas';

const Diagram = () => {
    const container = useRef<HTMLDivElement>(null);
    const [canvasSize, setCanvasSize] = useState<{ width: number, height: number }>({ width: 200, height: 200 });

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
            <Canvas size={canvasSize} />
        </div>
    );
};

export default Diagram;
