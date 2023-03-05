import Connection from '../shapes/Connection';
import type Shape from '../shapes/Shape';
import BoundingBox from '../util/BoundingBox';
import Point from '../util/Point';
import type { ActionPointType } from './ActionPoint';
import { ActionPoint } from './ActionPoint';

export type BoundingBoxSide = 'left' | 'right' | 'top' | 'bottom';
export const directions: Record<BoundingBoxSide, Point> = {
  left: new Point(-1, 0),
  right: new Point(1, 0),
  top: new Point(0, -1),
  bottom: new Point(0, 1),
};
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
    const end = start.add(directions[side].multiply(new Point(length, length)));
    const widthPoint = new Point(width / 2, width / 2);
    const widthForSide = widthPoint.multiply(directions[side].inverse());
    const area = new BoundingBox(
      start.subtract(widthForSide),
      end.add(widthForSide),
    );
    super(area, shape.canvasState);

    this.shape = shape;
    this.startPoint = start;
    this.endPoint = end;
    const sideLengthPoint = new Point(arrowSideLength, arrowSideLength);
    const lengthChange = directions[side].opposite().multiply(sideLengthPoint);
    this.arrowSidePoints = [
      end.add(lengthChange).add(directions[side].inverse().multiply(sideLengthPoint)),
      end.add(lengthChange).subtract(directions[side].inverse().multiply(sideLengthPoint)),
    ];
    this.connection = new Connection([shape, side], this.canvasState, shape.configuration);
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
  start(_point: Point): void {
    this.connection.start(this.startPoint);
  }
  private getSnapLocation(point: Point): [Shape, BoundingBoxSide] | null {
    for (const shape of this.shape.canvasState.shapes.filter((shape) => shape !== this.shape).filter((shape) => shape.canHaveConnections)) {
      if (!shape.boundingBox.contains(new Point(point.x, point.y))) {
        continue;
      }

      return [shape, shape.boundingBox.getClosestSide(point)];
    }

    return null;
  }
  move(point: Point): void {
    this.canvasState.draw();
    const snapLocation = this.getSnapLocation(point);
    this.connection.draw(snapLocation ? snapLocation[0].boundingBox[snapLocation[1]] : point);
  }
  finish(point: Point): void {
    const snapLocation = this.getSnapLocation(point);
    if (!snapLocation) {
      this.connection.finish(new Point(point.x, point.y));
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
