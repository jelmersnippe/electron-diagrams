import MoveCommand from '../shapes/commands/MoveCommand';
import type { Point } from '../shapes/Freehand';
import type { ActionPointType } from './ActionPoint';
import { ActionPoint } from './ActionPoint';

export class MoveActionPoint extends ActionPoint {
  type: ActionPointType = 'move';
  private initialPoint: Point = { x: 0, y: 0 };
  private previousPoint: Point = { x: 0, y: 0 };

  start(data: MouseEvent): void {
    const { x, y } = data;
    this.initialPoint = { x, y };
    this.previousPoint = { x, y };
  }

  move(data: MouseEvent): void {
    const { x, y } = data;
    for (const shape of this.canvasState.selectedShapes) {
      shape.move({ x: x - this.previousPoint.x, y: y - this.previousPoint.y });
    }
    this.canvasState.draw();
    this.previousPoint = { x, y };
  }

  finish(data: MouseEvent): void {
    const movedOffset: Point = { x: data.x - this.initialPoint.x, y: data.y - this.initialPoint.y };
    // Revert all shapes back to initial position
    for (const shape of this.canvasState.selectedShapes) {
      shape.move({ x: -movedOffset.x, y: -movedOffset.y });
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
