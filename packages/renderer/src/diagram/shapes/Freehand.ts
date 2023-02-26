import type { ToolboxConfiguration } from '../components/Toolbox';
import Shape from './Shape';

export type Point = { x: number; y: number; }
class Freehand extends Shape {
    cursorType = 'crosshair';

    prevPoint: [number, number] | null = null;
    mouseMoveCallback = this.draw.bind(this);
    points: Point[] = [];

    constructor(canvas: HTMLCanvasElement, configuration: ToolboxConfiguration) {
        super(canvas, configuration);
    }

    redo() {
        super.redo();

        for (let i = 1; i < this.points.length; i++) {
            const prevPoint = this.points[i - 1];
            const currentPoint = this.points[i];

            this.context.beginPath();
            this.context.moveTo(prevPoint.x, prevPoint.y);
            this.context.lineTo(currentPoint.x, currentPoint.y);
            this.context.stroke();
        }
    }

    start(data: MouseEvent) {
        super.start(data);

        const { x, y } = data;
        this.prevPoint = [x, y];
        this.draw(data);
    }

    draw(data: MouseEvent) {
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
        super.finish(data);
        const { x, y } = data;
        this.points.push({ x, y });
    }

    setBoundingBox() {
        const xValues = this.points.map((point) => point.x);
        const yValues = this.points.map((point) => point.y);

        this.boundingBox = {
            topLeft: {x: Math.min(...xValues), y: Math.min(...yValues)}, 
            bottomRight: {x: Math.max(...xValues), y: Math.max(...yValues)}
        };
    }
}

export const shapeTypes = ['freehand'] as const;
export type ShapeType = typeof shapeTypes[number];
export const createShape = (type: ShapeType, canvas: HTMLCanvasElement, configuration: ToolboxConfiguration): Shape => {
    switch (type) {
        case 'freehand':
            return new Freehand(canvas, configuration);
    }
};

export default Freehand;
