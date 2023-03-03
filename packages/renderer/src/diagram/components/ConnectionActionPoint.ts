import Connection from '../shapes/Connection';
import type { Point } from '../shapes/Freehand';
import type Shape from '../shapes/Shape';
import BoundingBox from '../util/BoundingBox';
import type { ActionPointType } from './ActionPoint';
import { ActionPoint } from './ActionPoint';

type Location = 'left' | 'right' | 'top' | 'bottom';
class ConnectionActionPoint extends ActionPoint {
  private startPoint: Point;
  private endPoint: Point;
  private arrowSidePoints: [Point, Point];
  private connection: Connection;
  private shape: Shape;

  type: ActionPointType = 'connection';

  constructor(location: Location, shape: Shape) {
    const width = 16;
    const length = 30;
    const arrowSideLength = width / 2;

    const start = shape.boundingBox[location];
    const end = {
      x: location === 'left' ? start.x - length : location === 'right' ? start.x + length : start.x,
      y: location === 'top' ? start.y - length : location === 'bottom' ? start.y + length : start.y,
    };
    const area = new BoundingBox(
      {
        x: location === 'left' || location === 'right' ? start.x : start.x - width / 2,
        y: location === 'top' || location === 'bottom' ? start.y : start.y - width / 2,
      },
      {
        x: location === 'left' || location === 'right' ? end.x : end.x + width / 2,
        y: location === 'top' || location === 'bottom' ? end.y : end.y + width / 2,
      },
    );
    super(area, shape.canvasState);

    this.shape = shape;
    this.startPoint = start;
    this.endPoint = end;
    this.arrowSidePoints = [
      {
        x: location === 'left' ? end.x + arrowSideLength : location === 'right' ? end.x - arrowSideLength : end.x - arrowSideLength,
        y: location === 'top' ? end.y + arrowSideLength : location === 'bottom' ? end.y - arrowSideLength : end.y + arrowSideLength,
      },
      {
        x: location === 'left' ? end.x + arrowSideLength : location === 'right' ? end.x - arrowSideLength : end.x + arrowSideLength,
        y: location === 'top' ? end.y + arrowSideLength : location === 'bottom' ? end.y - arrowSideLength : end.y - arrowSideLength,
      },
    ]; this.connection = new Connection(this.canvasState, shape.configuration);
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
  private getSnapLocation(data: MouseEvent): Point {
    let snapLocation: Point= {x: data.x, y: data.y};
    for (const shape of this.shape.canvasState.shapes.filter((shape) => shape !== this.shape)) {
      if (!shape.boundingBox.contains(data)) {
        continue;
      }

      snapLocation = shape.boundingBox.getClosestSide(data);
      break;
    }
    return snapLocation;
  }
  move(data: MouseEvent): void {
    this.canvasState.draw();
    this.connection.draw(this.getSnapLocation(data));
  }
  finish(data: MouseEvent): void {
    this.canvasState.executeCommand(this.connection.finish(this.getSnapLocation(data)));
  }
}

export default ConnectionActionPoint;
