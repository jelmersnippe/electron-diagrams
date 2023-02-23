import type { ToolboxConfiguration } from '../components/Toolbox';
import applyToolboxConfiguration from '../util/applyToolboxConfiguration';

type Point = { x: number; y: number; }
class Freehand {
    canvas: HTMLCanvasElement;
    cursorType = 'crosshair';
    context: CanvasRenderingContext2D;
    prevPoint: [number, number] | null = null;
    drawing = false;
    mouseMoveCallback = this.draw.bind(this);
    points: Point[] = [];
    configuration: ToolboxConfiguration;

    constructor(canvas: HTMLCanvasElement, configuration: ToolboxConfiguration) {
        this.canvas = canvas;
        const context = canvas.getContext('2d');
        if (context === null) {
            throw 'No 2D context found on passed canvas';
        }
        this.context = context;
        this.configuration = configuration;
    }

    redo(offset: Point) {
        applyToolboxConfiguration(this.context, this.configuration);
        this.canvas.style.cursor = 'crosshair';

        this.drawing = true;
        this.context.beginPath();
        for (let i = 1; i < this.points.length; i++) {
            const prevPoint = this.points[i-1];
            const currentPoint = this.points[i];

            this.context.moveTo(prevPoint.x + offset.x, prevPoint.y + offset.y);
            this.context.lineTo(currentPoint.x + offset.x, currentPoint.y + offset.y);
        }
        this.context.stroke();
        this.drawing = false;
    }

    init(data: MouseEvent) {
        if (this.drawing) {
            console.warn('Tried to start drawing on shape that was already drawing');
            return;
        }
        applyToolboxConfiguration(this.context, this.configuration);
        this.canvas.style.cursor = 'crosshair';

        this.drawing = true;
        const { x, y } = data;
        this.prevPoint = [x, y];
        this.points.push({ x, y });
        this.canvas.addEventListener('mousemove', this.mouseMoveCallback);
    }

    draw(data: MouseEvent) {
        if (!this.drawing) {
            console.warn('Tried to call draw on a shape that is not drawing');
            return;
        }
        const { x, y } = data;
        if (this.prevPoint !== null) {
            this.context.beginPath();
            this.context.moveTo(this.prevPoint[0], this.prevPoint[1]);
            this.points.push({ x, y });
            this.context.lineTo(x, y);
            this.context.stroke();
        }

        this.prevPoint = [x, y];
    }

    finish(data: MouseEvent) {
        if (!this.drawing) {
            console.warn('Tried to finish drawing on shape that was not drawing');
            return;
        }
        const { x, y } = data;
        this.points.push({ x, y });
        document.body.style.cursor = 'default';
        this.canvas.removeEventListener('mousemove', this.mouseMoveCallback);
        this.drawing = false;
    }
}

export type ShapeType = 'freehand';
export const createShape = (type: ShapeType, canvas: HTMLCanvasElement, configuration: ToolboxConfiguration): Freehand => {
    switch (type) {
        case 'freehand':
            return new Freehand(canvas, configuration);
    }
};

export default Freehand;
