import type CanvasState from '../components/CanvasState';
import type { ToolboxConfiguration } from '../components/Toolbox';
import type Command from './commands/Command';
import Shape from './Shape';

export type Point = { x: number; y: number; }
class Freehand extends Shape {
    cursorType = 'crosshair';

    prevPoint: [number, number] | null = null;
    mouseMoveCallback = this.draw.bind(this);
    points: Point[] = [];

    redo() {
        super.redo();

        for (let i = 1; i < this.points.length; i++) {
            const prevPoint = this.points[i - 1];
            const currentPoint = this.points[i];

            this.canvasState.context.beginPath();
            this.canvasState.context.moveTo(prevPoint.x, prevPoint.y);
            this.canvasState.context.lineTo(currentPoint.x, currentPoint.y);
            this.canvasState.context.stroke();
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
            this.canvasState.context.beginPath();
            this.canvasState.context.moveTo(this.prevPoint[0], this.prevPoint[1]);
            this.points.push({ x, y });
            this.canvasState.context.lineTo(x, y);
            this.canvasState.context.stroke();
        }

        this.prevPoint = [x, y];
    }

    finish(data: MouseEvent): Command {
        const { x, y } = data;
        this.points.push({ x, y });
        return super.finish(data);
    }

    setBoundingBox() {
        const xValues = this.points.map((point) => point.x);
        const yValues = this.points.map((point) => point.y);

        this.boundingBox = {
            topLeft: { x: Math.min(...xValues), y: Math.min(...yValues) },
            bottomRight: { x: Math.max(...xValues), y: Math.max(...yValues) }
        };
    }
}

export const shapeTypes = ['freehand'] as const;
export type ShapeType = typeof shapeTypes[number];
export const createShape = (type: ShapeType, canvasState: CanvasState, configuration: ToolboxConfiguration): Shape => {
    switch (type) {
        case 'freehand':
            return new Freehand(canvasState, configuration);
    }
};

export default Freehand;
