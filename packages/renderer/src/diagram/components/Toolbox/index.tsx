import { useState, useEffect } from 'react';
import { shapeTypes } from '../../shapes/Freehand';
import ColorInput from './components/Inputs/ColorPicker';
import NumberInput from './components/Inputs/NumberInput';
import SelectInput from './components/Inputs/SelectInput';
import './styles.css';

const DEFAULT_BRUSH_SIZE = 12;
const LINE_JOIN_OPTIONS: CanvasLineJoin[] = ['round', 'bevel', 'miter'];
const LINE_CAP_OPTIONS: CanvasLineCap[] = ['butt', 'round', 'square'];

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
    strokeStyle: '#000000',
});
interface Props {
    onUpdateConfiguration: (configuration: ToolboxConfiguration) => void;
}
const Toolbox = ({ onUpdateConfiguration }: Props) => {
    const [configuration, setConfiguration] = useState<ToolboxConfiguration>(getDefaultToolboxConfiguration());

    const updateProperty = <T extends keyof ToolboxConfiguration,>(property: T, value: ToolboxConfiguration[T]) => {
        setConfiguration({
            ...configuration,
            [property]: value,
        });
    };

    useEffect(() => {
        onUpdateConfiguration(configuration);
    }, [configuration]);

    return (
        <div className='toolbox'>
            <h2>Toolbox</h2>
            <div>
                <SelectInput
                    label="Shape"
                    value={configuration.currentShapeType}
                    onChange={(newValue) =>
                        updateProperty('currentShapeType', newValue)
                    }
                    options={shapeTypes}
                />
                <NumberInput
                    label="Brush Size"
                    value={configuration.brushSize}
                    onChange={(newValue) =>
                        updateProperty('brushSize', newValue)
                    }
                    min={1}
                    max={50}
                    step={1}
                />
                <SelectInput
                    label="Line Join"
                    value={configuration.lineJoin}
                    onChange={(newValue) =>
                        updateProperty('lineJoin', newValue)
                    }
                    options={LINE_JOIN_OPTIONS}
                />
                <SelectInput
                    label="Line Cap"
                    value={configuration.lineCap}
                    onChange={(newValue) =>
                        updateProperty('lineCap', newValue)
                    }
                    options={LINE_CAP_OPTIONS}
                />
                <ColorInput
                    label="Stroke Color"
                    value={configuration.strokeStyle}
                    onChange={(newValue) => {
                        updateProperty('strokeStyle', newValue);
                    }}
                />
            </div>
        </div>
    );
};

export default Toolbox;
