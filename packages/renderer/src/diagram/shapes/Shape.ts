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
    drawBoundingBox(): BoundingBox {
        if (!this.boundingBox) {
            throw 'No bounding box found to draw';
        }

        this.canvasState.context.strokeStyle = '#666';
        this.canvasState.context.lineWidth = 2;
        this.canvasState.context.setLineDash([5, 10]);
        const padding = this.configuration.brushSize + this.boundingBoxPadding;

        const topLeft = {x: this.boundingBox.topLeft.x - padding, y: this.boundingBox.topLeft.y - padding};
        const topRight = {x: this.boundingBox.bottomRight.x + padding, y: this.boundingBox.topLeft.y - padding};
        const bottomRight = {x: this.boundingBox.bottomRight.x + padding, y: this.boundingBox.bottomRight.y + padding};
        const bottomLeft = {x: this.boundingBox.topLeft.x - padding, y: this.boundingBox.bottomRight.y + padding};
        this.canvasState.context.beginPath();
        this.canvasState.context.moveTo(topLeft.x, topLeft.y);
        this.canvasState.context.lineTo(topRight.x, topRight.y);
        this.canvasState.context.lineTo(bottomRight.x, bottomRight.y);
        this.canvasState.context.lineTo(bottomLeft.x, bottomLeft.y);
        this.canvasState.context.lineTo(topLeft.x, topLeft.y);
        this.canvasState.context.stroke();

        return new BoundingBox(topLeft, bottomRight);
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
