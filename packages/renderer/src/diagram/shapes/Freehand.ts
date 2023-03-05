import type { ActionPoint } from '../components/ActionPoint';
import type DiagramState from '../components/CanvasState';
import type { ToolboxConfiguration } from '../components/Toolbox';
import BoundingBox from '../util/BoundingBox';
import Point from '../util/Point';
import Box from './Box';
import type Command from './commands/Command';
import Shape from './Shape';

class Freehand extends Shape {
  canHaveConnections = false;
  actionPoints: (() => ActionPoint)[] = [];
  cursorType = 'crosshair';

  prevPoint: Point | null = null;
  mouseMoveCallback = this.draw.bind(this);
  points: Point[] = [];

  redo() {
    this.setup();

    for (let i = 1; i < this.points.length; i++) {
      const prevPoint = this.points[i - 1];
      const currentPoint = this.points[i];

      this.canvasState.context.beginPath();
      this.canvasState.context.moveTo(prevPoint.x, prevPoint.y);
      this.canvasState.context.lineTo(currentPoint.x, currentPoint.y);
      this.canvasState.context.stroke();
    }
  }

  start(point: Point) {
    this.setup();

    this.prevPoint = point;
    this.draw(point);
  }

  draw(point: Point) {
    if (this.prevPoint !== null) {
      this.canvasState.context.beginPath();
      this.canvasState.context.moveTo(this.prevPoint.x, this.prevPoint.y);
      this.points.push(point);
      this.canvasState.context.lineTo(point.x, point.y);
      this.canvasState.context.stroke();
    }

    this.prevPoint = point;
  }

  finish(point: Point): Command {
    this.points.push(point);
    return super.finish(point);
  }

  setBoundingBox() {
    const padding = this.configuration.brushSize + this.boundingBoxPadding;
    const xValues = this.points.map((point) => point.x);
    const yValues = this.points.map((point) => point.y);

    this.boundingBox = new BoundingBox(new Point(Math.min(...xValues) - padding, Math.min(...yValues) - padding), new Point(Math.max(...xValues) + padding, Math.max(...yValues) + padding));
  }

  move(offset: Point) {
    this.points = this.points.map((point) => point.add(offset));

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
