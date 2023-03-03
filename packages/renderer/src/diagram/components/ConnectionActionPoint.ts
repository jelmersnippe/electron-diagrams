import Connection from '../shapes/Connection';
import type { Point } from '../shapes/Freehand';
import type Shape from '../shapes/Shape';
import BoundingBox from '../util/BoundingBox';
import type { ActionPointType } from './ActionPoint';
import { ActionPoint } from './ActionPoint';

export type BoundingBoxSide = 'left' | 'right' | 'top' | 'bottom';
class ConnectionActionPoint extends ActionPoint {
  private startPoint: Point;
  private endPoint: Point;
  private arrowSidePoints: [Point, Point];
  private connection: Connection;
  private shape: Shape;

  type: ActionPointType = 'connection';

  constructor(side: BoundingBoxSide, shape: Shape) {
    const width = 16;
    const length = 30;
    const arrowSideLength = width / 2;

    const start = shape.boundingBox[side];
    const end = {
      x: side === 'left' ? start.x - length : side === 'right' ? start.x + length : start.x,
      y: side === 'top' ? start.y - length : side === 'bottom' ? start.y + length : start.y,
    };
    const area = new BoundingBox(
      {
        x: side === 'left' || side === 'right' ? start.x : start.x - width / 2,
        y: side === 'top' || side === 'bottom' ? start.y : start.y - width / 2,
      },
      {
        x: side === 'left' || side === 'right' ? end.x : end.x + width / 2,
        y: side === 'top' || side === 'bottom' ? end.y : end.y + width / 2,
      },
    );
    super(area, shape.canvasState);

    this.shape = shape;
    this.startPoint = start;
    this.endPoint = end;
    this.arrowSidePoints = [
      {
        x: side === 'left' ? end.x + arrowSideLength : side === 'right' ? end.x - arrowSideLength : end.x - arrowSideLength,
        y: side === 'top' ? end.y + arrowSideLength : side === 'bottom' ? end.y - arrowSideLength : end.y + arrowSideLength,
      },
      {
        x: side === 'left' ? end.x + arrowSideLength : side === 'right' ? end.x - arrowSideLength : end.x + arrowSideLength,
        y: side === 'top' ? end.y + arrowSideLength : side === 'bottom' ? end.y - arrowSideLength : end.y - arrowSideLength,
      },
    ]; this.connection = new Connection([shape, side], this.canvasState, shape.configuration);
  }

  draw(): void {
    this.canvasState.context.lineWidth = 2;
    this.canvasState.context.strokeStyle = '#000';

    this.canvasState.context.beginPath();
    this.canvasState.context.moveTo(this.startPoint.x, this.startPoint.y);
    this.canvasState.context.lineTo(this.endPoint.x, this.endPoint.y);
    for (const point of this.arrowSidePoints) {
      this.canvasState.context.moveTo(this.endPoint.x, this.endPoint.y);
      this.canvasState.context.lineTo(point.x, point.y);
    }
    this.canvasState.context.stroke();
    this.canvasState.context.fillStyle = '#FF000040';
    this.canvasState.context.fillRect(this.area.topLeft.x, this.area.topLeft.y, this.area.bottomRight.x - this.area.topLeft.x, this.area.bottomRight.y - this.area.topLeft.y);
  }
  start(_data: MouseEvent): void {
    this.connection.start(this.startPoint);
  }
  private getSnapLocation(data: MouseEvent): [Shape, BoundingBoxSide] | null {
    for (const shape of this.shape.canvasState.shapes.filter((shape) => shape !== this.shape).filter((shape) => shape.canHaveConnections)) {
      if (!shape.boundingBox.contains(data)) {
        continue;
      }

      return [shape, shape.boundingBox.getClosestSide(data)];
    }

    return null;
  }
  move(data: MouseEvent): void {
    this.canvasState.draw();
    const snapLocation = this.getSnapLocation(data);
    this.connection.draw(snapLocation ? snapLocation[0].boundingBox[snapLocation[1]] : data);
  }
  finish(data: MouseEvent): void {
    const snapLocation = this.getSnapLocation(data);
    if (!snapLocation) {
      this.connection.finish(data);
      this.canvasState.draw();
      return;
    }
    this.connection.setAnchor('end', snapLocation);
    this.canvasState.executeCommand(this.connection.finish(snapLocation[0].boundingBox[snapLocation[1]]));

    this.shape.connections.push({location: snapLocation[1], line: this.connection});
    snapLocation[0].connections.push({location: snapLocation[1], line: this.connection});
  }
}

export default ConnectionActionPoint;
