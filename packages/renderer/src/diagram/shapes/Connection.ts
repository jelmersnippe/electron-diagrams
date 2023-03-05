import type { ActionPoint } from '../components/ActionPoint';
import type DiagramState from '../components/CanvasState';
import type { BoundingBoxSide } from '../components/ConnectionActionPoint';
import type { ToolboxConfiguration } from '../components/Toolbox';
import BoundingBox from '../util/BoundingBox';
import Point from '../util/Point';
import Shape from './Shape';

class Connection extends Shape {
  canHaveConnections = false;
  actionPoints: (() => ActionPoint)[] = [];
  private startAnchor: [Shape, BoundingBoxSide];
  private endAnchor: [Shape, BoundingBoxSide] | null = null;
  private points: Point[] = [];
  private get startPoint(): Point {
    return this.startAnchor[0].boundingBox[this.startAnchor[1]];
  }
  private get endPoint(): Point {
    return this.endAnchor ? this.endAnchor[0].boundingBox[this.endAnchor[1]] : new Point(0, 0);
  }
  private arrowSideLength = 8;
  private getArrowSidePoints = (point: Point, side: BoundingBoxSide) => [
    {
      x: side === 'right' ? point.x + this.arrowSideLength : side === 'left' ? point.x - this.arrowSideLength : point.x - this.arrowSideLength,
      y: side === 'bottom' ? point.y + this.arrowSideLength : side === 'top' ? point.y - this.arrowSideLength : point.y + this.arrowSideLength,
    },
    {
      x: side === 'right' ? point.x + this.arrowSideLength : side === 'left' ? point.x - this.arrowSideLength : point.x + this.arrowSideLength,
      y: side === 'bottom' ? point.y + this.arrowSideLength : side === 'top' ? point.y - this.arrowSideLength : point.y - this.arrowSideLength,
    },
  ];

  constructor(start: [Shape, BoundingBoxSide], diagramState: DiagramState, configuration: ToolboxConfiguration) {
    super(diagramState, configuration);
    this.startAnchor = start;
  }

  start(point: Point) {
    this.setup();

    this.draw(point);
    this.points.push(point);
  }
  private calculatePath(point: Point): Point[] {
    return [];
  }
  redo() {
    this.setup();

    this.draw(this.endPoint);
    if (!this.endAnchor) {
      return;
    }
    this.canvasState.context.beginPath();
    for (const point of this.getArrowSidePoints(this.endPoint, this.endAnchor[1])) {
      this.canvasState.context.moveTo(this.endPoint.x, this.endPoint.y);
      this.canvasState.context.lineTo(point.x, point.y);
    }
    this.canvasState.context.stroke();
  }
  draw(point: Point): void {
    this.canvasState.context.lineWidth = 2;
    this.canvasState.context.strokeStyle = '#000';
    this.canvasState.context.setLineDash([]);
    this.canvasState.context.beginPath();
    this.canvasState.context.moveTo(this.startPoint.x, this.startPoint.y);
    this.canvasState.context.lineTo(point.x, point.y);
    this.canvasState.context.stroke();
  }
  setBoundingBox(): void {
    this.boundingBox = new BoundingBox(this.startPoint, this.endPoint);
  }
  move(_offset: Point): void {
    this.setBoundingBox();
  }
  setAnchor(anchor: 'start' | 'end', placement: [Shape, BoundingBoxSide]) {
    const anchorToUpdate = anchor === 'start' ? 'startAnchor' : 'endAnchor';
    this[anchorToUpdate] = placement;
    this.setBoundingBox();
  }
}

export default Connection;
