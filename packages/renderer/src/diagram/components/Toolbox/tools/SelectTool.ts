import type DiagramState from '../../CanvasState';
import Tool from './Tool';
import BoundingBox from '/@/diagram/util/BoundingBox';
import Point from '/@/diagram/util/Point';

class SelectTool extends Tool {
  private initialPoint= new Point(0, 0);

  constructor(canvasState: DiagramState) {
    super(canvasState);
    this.canvasState = canvasState;
  }

  start(point: Point): void {
    this.initialPoint = point;
  }

  move(point: Point): void {
    // Force redraw so the previous selection box gets removed
    this.canvasState.draw();
    const { context } = this.canvasState;
    context.strokeStyle = '#666';
    context.lineWidth = 2;
    context.setLineDash([5, 10]);

    context.beginPath();
    context.moveTo(this.initialPoint.x, this.initialPoint.y);
    context.lineTo(this.initialPoint.x, point.y);
    context.lineTo(point.x, point.y);
    context.lineTo(point.x, this.initialPoint.y);
    context.lineTo(this.initialPoint.x, this.initialPoint.y);
    context.stroke();
  }

  finish(point: Point): void {
    const { x, y } = point;
    const minX = Math.min(x, this.initialPoint.x);
    const maxX = Math.max(x, this.initialPoint.x);
    const minY = Math.min(y, this.initialPoint.y);
    const maxY = Math.max(y, this.initialPoint.y);

    const selectedArea = new BoundingBox(new Point(minX, minY), new Point(maxX, maxY));
    this.canvasState.selectShapesWithinBoundingBox(selectedArea);
  }

}

export default SelectTool;

