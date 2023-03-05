import MoveCommand from '../shapes/commands/MoveCommand';
import Point from '../util/Point';
import type { ActionPointType } from './ActionPoint';
import { ActionPoint } from './ActionPoint';

export class MoveActionPoint extends ActionPoint {
  type: ActionPointType = 'move';
  private initialPoint = new Point(0, 0);
  private previousPoint = new Point(0, 0);

  start(point: Point): void {
    this.initialPoint = point;
    this.previousPoint = point;
  }

  move(point: Point): void {
    for (const shape of this.canvasState.selectedShapes) {
      shape.move(point.subtract(this.previousPoint));
    }
    this.canvasState.draw();
    this.previousPoint = point;
  }

  finish(point: Point): void {
    const movedOffset = point.subtract(this.initialPoint);
    // Revert all shapes back to initial position
    for (const shape of this.canvasState.selectedShapes) {
      shape.move(movedOffset.opposite());
    }

    this.canvasState.executeCommand(new MoveCommand(this.canvasState.selectedShapes, movedOffset));
  }

  draw(): void {
    this.canvasState.context.fillStyle = '#FF000040';
    this.canvasState.context.fillRect(this.area.topLeft.x, this.area.topLeft.y, this.area.bottomRight.x - this.area.topLeft.x, this.area.bottomRight.y - this.area.topLeft.y);

    this.canvasState.context.strokeStyle = '#666';
    this.canvasState.context.lineWidth = 2;
    this.canvasState.context.setLineDash([5, 10]);

    this.canvasState.context.beginPath();
    this.canvasState.context.moveTo(this.area.topLeft.x, this.area.topLeft.y);
    this.canvasState.context.lineTo(this.area.topRight.x, this.area.topRight.y);
    this.canvasState.context.lineTo(this.area.bottomRight.x, this.area.bottomRight.y);
    this.canvasState.context.lineTo(this.area.bottomLeft.x, this.area.bottomLeft.y);
    this.canvasState.context.lineTo(this.area.topLeft.x, this.area.topLeft.y);
    this.canvasState.context.stroke();
  }
}

export default MoveActionPoint;
