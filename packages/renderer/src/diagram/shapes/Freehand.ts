import type { ActionPoint } from '../components/ActionPoint';
import type DiagramState from '../components/CanvasState';
import type { ToolboxConfiguration } from '../components/Toolbox';
import BoundingBox from '../util/BoundingBox';
import Box from './Box';
import type Command from './commands/Command';
import Shape from './Shape';

export type Point = { x: number; y: number; }
class Freehand extends Shape {
    actionPoints: (() => ActionPoint)[] = [];
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
        const padding = this.configuration.brushSize + this.boundingBoxPadding;
        const xValues = this.points.map((point) => point.x);
        const yValues = this.points.map((point) => point.y);

        this.boundingBox = new BoundingBox({ x: Math.min(...xValues) - padding, y: Math.min(...yValues) - padding }, { x: Math.max(...xValues) + padding, y: Math.max(...yValues) + padding });
    }

    move(offset: Point) {
      this.points = this.points.map((point) => ({x: point.x + offset.x, y: point.y + offset.y}));

      // TODO: Move this generic logic to the abstract class
      this.setBoundingBox();
    }
}

export const shapeTypes = ['freehand', 'box'] as const;
export type ShapeType = typeof shapeTypes[number];
export const createShape = (type: ShapeType, canvasState: DiagramState, configuration: ToolboxConfiguration): Shape => {
    switch (type) {
        case 'freehand':
            return new Freehand(canvasState, configuration);
        case 'box':
          return new Box(canvasState, configuration);
    }
};

export default Freehand;
