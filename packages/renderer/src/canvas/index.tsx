import { useEffect, useState, useRef } from 'react';
import Toolbox, { getDefaultToolboxConfiguration } from './components/Toolbox';
import type { ToolboxConfiguration } from './components/Toolbox';
import Canvas from './components/Canvas';

const Diagram = () => {
    const container = useRef<HTMLDivElement>(null);
    const [canvasSize, setCanvasSize] = useState<{ width: number, height: number }>({ width: 200, height: 200 });
    const [configuration, setConfiguration] = useState<ToolboxConfiguration>(getDefaultToolboxConfiguration());


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
            <Toolbox onUpdateConfiguration={(configuration) => setConfiguration(configuration)} />
            <Canvas size={canvasSize} configuration={configuration} />
        </div>
    );
};

export default Diagram;
