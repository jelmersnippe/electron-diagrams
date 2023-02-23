import type { ToolboxConfiguration } from '../components/Toolbox';
import Shape from './Shape';

type Point = { x: number; y: number; }
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

        this.context.beginPath();
        for (let i = 1; i < this.points.length; i++) {
            const prevPoint = this.points[i - 1];
            const currentPoint = this.points[i];

            this.context.moveTo(prevPoint.x, prevPoint.y);
            this.context.lineTo(currentPoint.x, currentPoint.y);
        }
        this.context.stroke();
    }

    start(data: MouseEvent) {
        super.start(data);

        const { x, y } = data;
        this.prevPoint = [x, y];
        this.draw(data);
    }

    draw(data: MouseEvent) {
        super.draw(data);
        
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
}

export type ShapeType = 'freehand';
export const createShape = (type: ShapeType, canvas: HTMLCanvasElement, configuration: ToolboxConfiguration): Shape => {
    switch (type) {
        case 'freehand':
            return new Freehand(canvas, configuration);
    }
};

export default Freehand;
