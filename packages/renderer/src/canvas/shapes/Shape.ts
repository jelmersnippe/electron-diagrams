import type { ToolboxConfiguration } from '../components/Toolbox';
import applyToolboxConfiguration from '../util/applyToolboxConfiguration';

export default abstract class Shape {
    cursorType = 'crosshair';
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    state: 'idle' | 'drawing' | 'finished' = 'idle';
    configuration: ToolboxConfiguration;
    mouseMoveCallback = this.draw.bind(this);

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

    }

    finish(event: MouseEvent) {
        if (this.state !== 'drawing') {
            throw 'Tried to finish drawing on shape that was not drawing';
        }
        this.canvas.removeEventListener('mousemove', this.mouseMoveCallback);
        this.canvas.style.cursor = 'default';
        this.state = 'finished';
    }
}
