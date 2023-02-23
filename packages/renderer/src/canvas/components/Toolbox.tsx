import { useState, useEffect } from 'react';

const DEFAULT_BRUSH_SIZE = 12;

export type ToolboxConfiguration = {
    brushSize: number;
    currentShapeType: 'freehand';
    lineJoin: CanvasLineJoin;
    lineCap: CanvasLineCap;
    strokeStyle: string;
}
export const getDefaultToolboxConfiguration = (): ToolboxConfiguration => ({
    brushSize: DEFAULT_BRUSH_SIZE,
    currentShapeType: 'freehand',
    lineJoin: 'round',
    lineCap: 'round',
    strokeStyle: 'black'
});
interface Props {
    onUpdateConfiguration: (configuration: ToolboxConfiguration) => void;
}
const Toolbox = ({ onUpdateConfiguration }: Props) => {
    const [brushSize, setBrushSize] = useState<number>(DEFAULT_BRUSH_SIZE);

    useEffect(() => {
        onUpdateConfiguration({
            ...getDefaultToolboxConfiguration(),
            brushSize
        });
    }, [brushSize]);

    return (
        <div className='toolbox'>
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
    );
};

export default Toolbox;
