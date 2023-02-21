import { useState, useEffect } from 'react';

const DEFAULT_BRUSH_SIZE = 12;

interface Props {
    context: CanvasRenderingContext2D;
}
const Toolbox = ({ context }: Props) => {
    const [brushSize, setBrushSize] = useState<number>(DEFAULT_BRUSH_SIZE);

    useEffect(() => {
        context.lineWidth = brushSize;
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
