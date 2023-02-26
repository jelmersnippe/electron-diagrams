import type { ToolboxConfiguration } from '../components/Toolbox';
import applyToolboxConfiguration from '../util/applyToolboxConfiguration';
import type { Point } from './Freehand';

export default abstract class Shape {
    cursorType = 'crosshair';
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    state: 'idle' | 'drawing' | 'finished' = 'idle';
    configuration: ToolboxConfiguration;
    mouseMoveCallback = this.draw.bind(this);
    boundingBox: {topLeft: Point; bottomRight: Point} | null = null;

    constructor(canvas: HTMLCanvasElement, configuration: ToolboxConfiguration) {
        this.canvas = canvas;
        const context = canvas.getContext('2d');
        if (context === null) {
            throw 'No 2D context found on passed canvas';
        }
        this.context = context;
        this.configuration = configuration;
    }

    private setup() {
        applyToolboxConfiguration(this.context, this.configuration);
        this.canvas.style.cursor = 'crosshair';

        this.state = 'drawing';
    }

    drawBoundingBox() {
        if (!this.boundingBox) {
            throw 'No bounding box found to draw';
        }

        this.context.strokeStyle = '#666';
        this.context.lineWidth = 4;
        this.context.setLineDash([5,10]);
        const padding = this.configuration.brushSize + 5;

        this.context.beginPath();
        this.context.moveTo(this.boundingBox.topLeft.x - padding, this.boundingBox.topLeft.y - padding);
        this.context.lineTo(this.boundingBox.bottomRight.x + padding, this.boundingBox.topLeft.y - padding);
        this.context.lineTo(this.boundingBox.bottomRight.x + padding, this.boundingBox.bottomRight.y + padding);
        this.context.lineTo(this.boundingBox.topLeft.x - padding, this.boundingBox.bottomRight.y + padding);
        this.context.lineTo(this.boundingBox.topLeft.x - padding, this.boundingBox.topLeft.y - padding);
        this.context.stroke();
    }

    redo() {
        this.setup();
    }

    start(event: MouseEvent) {
        if (this.state !== 'idle') {
            throw 'Tried to start drawing on shape that was already drawing';
        }
        this.setup();
        this.canvas.addEventListener('mousemove', this.mouseMoveCallback);
    }

    draw(event: MouseEvent) {
        throw 'Abstract method \'draw\' not implemented';
    }

    finish(event: MouseEvent) {
        if (this.state !== 'drawing') {
            throw 'Tried to finish drawing on shape that was not drawing';
        }
        this.canvas.removeEventListener('mousemove', this.mouseMoveCallback);
        this.canvas.style.cursor = 'default';
        this.setBoundingBox();
        this.state = 'finished';
    }

    setBoundingBox() {
        throw 'Abstract method \'setBoundingBox\' not implemented';
    }
}
