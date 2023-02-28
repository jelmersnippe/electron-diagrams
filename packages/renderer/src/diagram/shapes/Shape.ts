import type { ToolboxConfiguration } from '../components/Toolbox';
import applyToolboxConfiguration from '../util/applyToolboxConfiguration';
import DrawCommand from './commands/DrawCommand';
import type { Point } from './Freehand';
import type DiagramState from '../components/CanvasState';
import type Command from './commands/Command';

export type BoundingBox = { topLeft: Point; bottomRight: Point };
export default abstract class Shape {
    cursorType = 'crosshair';
    drawing = false;
    configuration: ToolboxConfiguration;
    mouseMoveCallback = this.draw.bind(this);
    boundingBox: BoundingBox | null = null;

    canvasState: DiagramState;

    constructor(canvasState: DiagramState, configuration: ToolboxConfiguration) {
        this.canvasState = canvasState;
        this.configuration = configuration;
    }

    private setup() {
        applyToolboxConfiguration(this.canvasState.context, this.configuration);
        this.canvasState.canvas.style.cursor = 'crosshair';
    }

    drawBoundingBox() {
        if (!this.boundingBox) {
            throw 'No bounding box found to draw';
        }

        this.canvasState.context.strokeStyle = '#666';
        this.canvasState.context.lineWidth = 2;
        this.canvasState.context.setLineDash([5, 10]);
        const padding = this.configuration.brushSize + 5;

        this.canvasState.context.beginPath();
        this.canvasState.context.moveTo(this.boundingBox.topLeft.x - padding, this.boundingBox.topLeft.y - padding);
        this.canvasState.context.lineTo(this.boundingBox.bottomRight.x + padding, this.boundingBox.topLeft.y - padding);
        this.canvasState.context.lineTo(this.boundingBox.bottomRight.x + padding, this.boundingBox.bottomRight.y + padding);
        this.canvasState.context.lineTo(this.boundingBox.topLeft.x - padding, this.boundingBox.bottomRight.y + padding);
        this.canvasState.context.lineTo(this.boundingBox.topLeft.x - padding, this.boundingBox.topLeft.y - padding);
        this.canvasState.context.stroke();
    }

    redo() {
        this.setup();
    }

    start(event: MouseEvent) {
        this.setup();
        this.canvasState.canvas.addEventListener('mousemove', this.mouseMoveCallback);
        this.drawing = true;
    }

    draw(event: MouseEvent) {
        throw 'Abstract method \'draw\' not implemented';
    }

    finish(event: MouseEvent): Command {
        this.canvasState.canvas.removeEventListener('mousemove', this.mouseMoveCallback);
        this.canvasState.canvas.style.cursor = 'default';
        this.setBoundingBox();
        this.drawing = false;

        return new DrawCommand(this, this.canvasState);
    }

    setBoundingBox() {
        throw 'Abstract method \'setBoundingBox\' not implemented';
    }
}
