import type { Point } from 'electron';
import type DiagramState from '../../components/CanvasState';
import type Command from './Command';

class MoveCommand implements Command {
  private readonly canvasState: DiagramState;
  private readonly offset: Point;

  constructor(canvasState: DiagramState, offset: Point) {
    this.canvasState = canvasState;
    this.offset = offset;
  }

  execute(): void {
    for (const shape of this.canvasState.selectedShapes) {
      shape.move(this.offset);
    }
    this.canvasState.setSelectedShapes(this.canvasState.selectedShapes);
  }

  undo() {
    for (const shape of this.canvasState.selectedShapes) {
      shape.move({ x: -this.offset.x, y: -this.offset.y });
    }
    this.canvasState.setSelectedShapes(this.canvasState.selectedShapes);
  }
}

export default MoveCommand;
