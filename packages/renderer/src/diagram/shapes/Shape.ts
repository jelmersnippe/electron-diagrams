import type { ToolboxConfiguration } from '../components/Toolbox';
import applyToolboxConfiguration from '../util/applyToolboxConfiguration';
import DrawCommand from './commands/DrawCommand';
import type DiagramState from '../components/CanvasState';
import type Command from './commands/Command';
import BoundingBox from '../util/BoundingBox';
import type { Point } from './Freehand';

export default abstract class Shape {
    cursorType = 'crosshair';
    drawing = false;
    configuration: ToolboxConfiguration;
    mouseMoveCallback = this.draw.bind(this);
    boundingBox: BoundingBox | null = null;
    boundingBoxPadding = 5;

    canvasState: DiagramState;

    constructor(canvasState: DiagramState, configuration: ToolboxConfiguration) {
        this.canvasState = canvasState;
        this.configuration = configuration;
    }

    private setup() {
        applyToolboxConfiguration(this.canvasState.context, this.configuration);
        this.canvasState.canvas.style.cursor = 'crosshair';
    }

    // Returns the padded BoundingBox for any action point creation
    drawBoundingBox() {
        if (!this.boundingBox) {
            throw 'No bounding box found to draw';
        }

        this.canvasState.context.strokeStyle = '#666';
        this.canvasState.context.lineWidth = 2;
        this.canvasState.context.setLineDash([5, 10]);

        this.canvasState.context.beginPath();
        this.canvasState.context.moveTo(this.boundingBox.topLeft.x, this.boundingBox.topLeft.y);
        this.canvasState.context.lineTo(this.boundingBox.topRight.x, this.boundingBox.topRight.y);
        this.canvasState.context.lineTo(this.boundingBox.bottomRight.x, this.boundingBox.bottomRight.y);
        this.canvasState.context.lineTo(this.boundingBox.bottomLeft.x, this.boundingBox.bottomLeft.y);
        this.canvasState.context.lineTo(this.boundingBox.topLeft.x, this.boundingBox.topLeft.y);
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

    finish(event: MouseEvent): Command {
        this.canvasState.canvas.removeEventListener('mousemove', this.mouseMoveCallback);
        this.canvasState.canvas.style.cursor = 'default';
        this.setBoundingBox();
        this.drawing = false;

        return new DrawCommand(this, this.canvasState);
    }

    abstract draw(event: MouseEvent): void
    abstract setBoundingBox(): void
    abstract move(offset: Point): void;
}
