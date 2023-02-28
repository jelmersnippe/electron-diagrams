import MouseInteractible from '../../../util/MouseInteractible';
import type DiagramState from '../../CanvasState';

abstract class Tool extends MouseInteractible {
  protected canvasState: DiagramState;

  constructor(canvasState: DiagramState) {
    super(canvasState.canvas);
    this.canvasState = canvasState;
  }

  protected canStart(data: MouseEvent): boolean {
    if (!super.canStart(data)) {
      return false;
    }
    return !this.canvasState.interactingWithActionPoint;
  }
}

export default Tool;
