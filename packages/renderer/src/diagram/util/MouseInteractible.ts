import type DiagramState from '../components/CanvasState';

abstract class MouseInteractible {
  abstract start(data: MouseEvent): void;
  abstract move(data: MouseEvent): void;
  abstract finish(data: MouseEvent): void;

  protected canvasState: DiagramState;

  private onMouseUpCallback = this.onMouseUp.bind(this);
  private onMouseMoveCallback = this.move.bind(this);

  constructor(canvasState: DiagramState) {
    this.canvasState = canvasState;
  }

  deregister() {
    this.canvasState.canvas.removeEventListener('mouseleave', this.onMouseUpCallback);
    this.canvasState.canvas.removeEventListener('mouseup', this.onMouseUpCallback);
    this.canvasState.canvas.removeEventListener('mousemove', this.onMouseMoveCallback);
  }

  onMouseDown(data: MouseEvent) {
    this.canvasState.interactingWithActionPoint = true;

    this.canvasState.canvas.addEventListener('mouseleave', this.onMouseUpCallback);
    this.canvasState.canvas.addEventListener('mouseup', this.onMouseUpCallback);
    this.canvasState.canvas.addEventListener('mousemove', this.onMouseMoveCallback);
    this.start(data);
  }

  private onMouseUp(data: MouseEvent) {
    const leftMouseButtonDown = data.buttons % 2 !== 0;
    if (data.type !== 'mouseleave' && leftMouseButtonDown) {
      return;
    }

    this.canvasState.interactingWithActionPoint = false;

    this.finish(data);
    this.canvasState.canvas.removeEventListener('mousemove', this.onMouseMoveCallback);
    this.canvasState.canvas.removeEventListener('mouseup', this.onMouseUpCallback);
    this.canvasState.canvas.removeEventListener('mouseleave', this.onMouseUpCallback);
  }
}

export default MouseInteractible;

