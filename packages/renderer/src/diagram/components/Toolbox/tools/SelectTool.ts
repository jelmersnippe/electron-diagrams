import type DiagramState from '../../CanvasState';
import type { Point } from '/@/diagram/shapes/Freehand';
import BoundingBox from '/@/diagram/util/BoundingBox';
import MouseInteractible from '/@/diagram/util/MouseInteractible';

class SelectTool extends MouseInteractible {
  private initialPoint: Point = { x: 0, y: 0 };
  private canvasState: DiagramState;

  constructor(canvasState: DiagramState) {
    super(canvasState.canvas);
    this.canvasState = canvasState;
  }

  start(data: MouseEvent): void {
    const { x, y } = data;
    this.initialPoint = { x, y };
  }

  move(data: MouseEvent): void {
    // Force redraw so the previous selection box gets removed
    this.canvasState.draw();
    const { context } = this.canvasState;
    context.strokeStyle = '#666';
    context.lineWidth = 2;
    context.setLineDash([5, 10]);

    context.beginPath();
    context.moveTo(this.initialPoint.x, this.initialPoint.y);
    context.lineTo(this.initialPoint.x, data.y);
    context.lineTo(data.x, data.y);
    context.lineTo(data.x, this.initialPoint.y);
    context.lineTo(this.initialPoint.x, this.initialPoint.y);
    context.stroke();
  }

  finish(data: MouseEvent): void {
    const { x, y } = data;
    const minX = Math.min(x, this.initialPoint.x);
    const maxX = Math.max(x, this.initialPoint.x);
    const minY = Math.min(y, this.initialPoint.y);
    const maxY = Math.max(y, this.initialPoint.y);

    const selectedArea = new BoundingBox({ x: minX, y: minY }, { x: maxX, y: maxY });
    this.canvasState.selectShapesWithinBoundingBox(selectedArea);
  }

}

export default SelectTool;

