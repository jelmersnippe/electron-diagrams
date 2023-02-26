import type {ToolboxConfiguration} from '../components/Toolbox';

const applyToolboxConfiguration = (context: CanvasRenderingContext2D, configuration: ToolboxConfiguration) => {
    context.lineWidth = configuration.brushSize;
    context.lineJoin = configuration.lineJoin;
    context.lineCap = configuration.lineCap;
    context.strokeStyle = configuration.strokeStyle;
};

export default applyToolboxConfiguration;
