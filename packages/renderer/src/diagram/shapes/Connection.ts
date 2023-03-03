import type { ActionPoint } from '../components/ActionPoint';
import type DiagramState from '../components/CanvasState';
import type { BoundingBoxSide } from '../components/ConnectionActionPoint';
import type { ToolboxConfiguration } from '../components/Toolbox';
import BoundingBox from '../util/BoundingBox';
import type { Point } from './Freehand';
import Shape from './Shape';

class Connection extends Shape {
  canHaveConnections = false;
  actionPoints: (() => ActionPoint)[] = [];
  private startAnchor: [Shape, BoundingBoxSide];
  private endAnchor: [Shape, BoundingBoxSide] | null = null;
  private get startPoint(): Point {
    return this.startAnchor[0].boundingBox[this.startAnchor[1]];
  }
  private get endPoint(): Point {
    return this.endAnchor ? this.endAnchor[0].boundingBox[this.endAnchor[1]] : {x: 0, y: 0};
  }

  constructor(start: [Shape, BoundingBoxSide], diagramState: DiagramState, configuration: ToolboxConfiguration) {
    super(diagramState, configuration);
    this.startAnchor = start;
  }

  start(data: Point) {
    this.setup();

    this.draw(data);
  }
  redo() {
    this.setup();

    this.draw(this.endPoint);
  }
  draw(event: Point): void {
    this.canvasState.context.lineWidth = 2;
    this.canvasState.context.strokeStyle = '#000';
    this.canvasState.context.setLineDash([]);
    this.canvasState.context.beginPath();
    this.canvasState.context.moveTo(this.startPoint.x, this.startPoint.y);
    this.canvasState.context.lineTo(event.x, event.y);
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
