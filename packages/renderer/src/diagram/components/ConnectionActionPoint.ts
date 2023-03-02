import { Point } from '../shapes/Freehand';
import type BoundingBox from '../util/BoundingBox';
import type { ActionPointType } from './ActionPoint';
import { ActionPoint } from './ActionPoint';
import type DiagramState from './CanvasState';

type Direction = 'left' | 'right' | 'up' | 'down';
class ConnectionActionPoint extends ActionPoint {
  private startPoint: Point;
  private endPoint: Point;
  private arrowSidePoints: [Point, Point];

  type: ActionPointType = 'connection';
  constructor(direction: Direction, area: BoundingBox, canvasState: DiagramState) {
    super(area, canvasState);

    const isVertical = this.area.height > this.area.width;
    const halfShortSide = isVertical ? this.area.width /2 : this.area.height/ 2;
    const arrowSideLength = (direction === 'left' || direction === 'up') ? -halfShortSide : halfShortSide;
    const longSide = isVertical ? this.area.height : this.area.width;
    let start = isVertical ? { x: this.area.center.x, y: this.area.center.y - (longSide / 2) } : {x: this.area.center.x - (longSide / 2), y: this.area.center.y};
    let end = isVertical ? { x: this.area.center.x, y: this.area.center.y + (longSide / 2) } : {x: this.area.center.x + (longSide / 2), y: this.area.center.y};
    if (direction === 'left' || direction === 'up') {
      const tmp = start;
      start = end;
      end = tmp;
    }
    this.startPoint = start;
    this.endPoint = end;
    this.arrowSidePoints = isVertical
      ? [
    {x: end.x - arrowSideLength, y: end.y - arrowSideLength},
    {x: end.x + arrowSideLength, y: end.y - arrowSideLength},
      ]
      : [
    {x: end.x - arrowSideLength, y: end.y - arrowSideLength},
    {x: end.x - arrowSideLength, y: end.y + arrowSideLength},
      ];
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
  start(data: MouseEvent): void {
    console.log('starting connection creationg');
  }
  move(data: MouseEvent): void {
    console.log('moving connection creationg');
  }
  finish(data: MouseEvent): void {
    console.log('finishing connection creationg');
  }
}

export default ConnectionActionPoint;
