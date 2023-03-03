import { useEffect, useState } from 'react';
import type { ShapeType } from '../../shapes/Freehand';
import type DiagramState from '../CanvasState';
import ColorInput from './components/Inputs/ColorPicker';
import NumberInput from './components/Inputs/NumberInput';
import SelectInput from './components/Inputs/SelectInput';
import './styles.css';
import DrawTool from './tools/DrawTool';
import SelectTool from './tools/SelectTool';
import type Tool from './tools/Tool';

const DEFAULT_BRUSH_SIZE = 12;
const LINE_JOIN_OPTIONS: CanvasLineJoin[] = ['round', 'bevel', 'miter'];
const LINE_CAP_OPTIONS: CanvasLineCap[] = ['butt', 'round', 'square'];

export type ToolType = 'select' | ShapeType;
type ToolOption = { type: ToolType; tool: (state: DiagramState, configuration: ToolboxConfiguration) => Tool };
const tools: ToolOption[] = [
  { type: 'freehand', tool: (state, configuration) => new DrawTool(state, 'freehand', configuration) },
  { type: 'box', tool: (state, configuration) => new DrawTool(state, 'box', configuration) },
  { type: 'select', tool: (state) => new SelectTool(state) },
];

export type ToolboxConfiguration = {
  brushSize: number;
  lineJoin: CanvasLineJoin;
  lineCap: CanvasLineCap;
  strokeStyle: string;
  lineDash: number[];
}
export const getDefaultToolboxConfiguration = (): ToolboxConfiguration => ({
  brushSize: DEFAULT_BRUSH_SIZE,
  lineJoin: 'round',
  lineCap: 'round',
  strokeStyle: '#000000',
  lineDash: [],
});

interface Props {
  diagramState: DiagramState;
}
const Toolbox = ({ diagramState }: Props) => {
  const [selectedToolIndex, setSelectedToolIndex] = useState(0);
  const [configuration, setConfiguration] = useState<ToolboxConfiguration>(getDefaultToolboxConfiguration());

  useEffect(() => {
    diagramState.currentTool = tools[selectedToolIndex].tool(diagramState, configuration);
  }, [diagramState, configuration, selectedToolIndex]);

  const updateProperty = <T extends keyof ToolboxConfiguration,>(property: T, value: ToolboxConfiguration[T]) => {
    setConfiguration({
      ...configuration,
      [property]: value,
    });
  };

  return (
    <div className='toolbox'>
      <h2>Toolbox</h2>
        <button onClick={() => diagramState.undo()}>Undo</button>
        <button onClick={() => diagramState.redo()}>Redo</button>
      <div>
        <SelectInput
          label="Tool"
          value={tools[selectedToolIndex].type}
          onChange={(_, index) => {
            setSelectedToolIndex(index);
          }}
          options={tools.map((tool) => tool.type)}
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
