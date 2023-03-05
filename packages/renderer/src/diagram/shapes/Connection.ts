import type { ActionPoint } from '../components/ActionPoint';
import type DiagramState from '../components/CanvasState';
import { BoundingBoxSide, directions } from '../components/ConnectionActionPoint';
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
  private getArrowSidePoints = (point: Point, side: BoundingBoxSide) => {
    const sideLengthPoint = new Point(8, 8);
    const lengthChange = directions[side].multiply(sideLengthPoint);
    return [
      point.add(lengthChange).add(directions[side].inverse().multiply(sideLengthPoint)),
      point.add(lengthChange).subtract(directions[side].inverse().multiply(sideLengthPoint)),
    ];
  };

  constructor(start: [Shape, BoundingBoxSide], diagramState: DiagramState, configuration: ToolboxConfiguration) {
    super(diagramState, configuration);
    this.startAnchor = start;
  }

  start(point: Point) {
    this.setup();

    this.draw(point);
  }
  private calculatePath(point: Point): Point[] {
    const standoff = new Point(20, 20);
    const points: Point[] = [];
    points.push(this.startPoint);
    const standoffStartPoint = this.startPoint.add(standoff.multiply(directions[this.startAnchor[1]]));
    points.push(standoffStartPoint);

    const finalPoint = this.endAnchor ? this.endPoint.add(standoff.multiply(directions[this.endAnchor[1]])) : point;
    if (!finalPoint.isInLineWith(standoffStartPoint)) {
      const distance = finalPoint.subtract(standoffStartPoint);
      points.push(distance.x > distance.y ? new Point(standoffStartPoint.x, finalPoint.y) : new Point(finalPoint.x, standoffStartPoint.y));
    }

    points.push(finalPoint);
    if (this.endAnchor) {
      points.push(this.endPoint);
    }

    return points;
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
    const points = this.calculatePath(point);
    this.canvasState.context.lineWidth = 2;
    this.canvasState.context.strokeStyle = '#000';
    this.canvasState.context.setLineDash([]);
    this.canvasState.context.beginPath();
    this.canvasState.context.moveTo(this.startPoint.x, this.startPoint.y);
    for (let i = 1; i < points.length; i++) {
      this.canvasState.context.lineTo(points[i].x, points[i].y);
    }
    this.canvasState.context.stroke();
  }
  setBoundingBox(): void {
    this.boundingBox = new BoundingBox(this.startPoint, this.endPoint);
  }
  move(_offset: Point): void {
    this.setBoundingBox();
  }
  setEndAnchor(placement: [Shape, BoundingBoxSide] | null) {
    this.endAnchor = placement;
    if (placement) {
      this.draw(placement[0].boundingBox[placement[1]]);
    }
  }
}

export default Connection;
