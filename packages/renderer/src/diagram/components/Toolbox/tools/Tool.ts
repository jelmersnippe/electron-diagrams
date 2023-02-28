import type DiagramState from '../../CanvasState';

abstract class Tool {
  abstract start(data: MouseEvent): void;
  abstract move(data: MouseEvent): void;
  abstract finish(data: MouseEvent): void;

  protected canvasState: DiagramState;
  protected started = false;

  private onMouseDownCallback = this.onMouseDown.bind(this);
  private onMouseUpCallback = this.onMouseUp.bind(this);
  private onMouseMoveCallback = this.move.bind(this);

  constructor(canvasState: DiagramState) {
    this.canvasState = canvasState;

    canvasState.canvas.addEventListener('mousedown', this.onMouseDownCallback);
  }

  deregister() {
    this.canvasState.canvas.removeEventListener('mousedown', this.onMouseDownCallback);
    this.canvasState.canvas.removeEventListener('mouseleave', this.onMouseUpCallback);
    this.canvasState.canvas.removeEventListener('mouseup', this.onMouseUpCallback);
    this.canvasState.canvas.removeEventListener('mousemove', this.onMouseMoveCallback);
  }

  private onMouseDown(data: MouseEvent) {
    if (this.started) {
      return;
    }
    const leftMouseButtonDown = data.buttons % 2 !== 0;
    if (!leftMouseButtonDown) {
      return;
    }
    this.started = true;

    this.canvasState.canvas.removeEventListener('mousedown', this.onMouseDownCallback);
    this.canvasState.canvas.addEventListener('mouseleave', this.onMouseUpCallback);
    this.canvasState.canvas.addEventListener('mouseup', this.onMouseUpCallback);
    this.canvasState.canvas.addEventListener('mousemove', this.onMouseMoveCallback);
    this.start(data);
  }

  private onMouseUp(data: MouseEvent) {
    if (!this.started) {
      return;
    }

    const leftMouseButtonDown = data.buttons % 2 !== 0;
    if (data.type !== 'mouseleave' && leftMouseButtonDown) {
      return;
    }

    this.started = false;
    this.finish(data);
    this.canvasState.canvas.removeEventListener('mousemove', this.onMouseMoveCallback);
    this.canvasState.canvas.removeEventListener('mouseup', this.onMouseUpCallback);
    this.canvasState.canvas.removeEventListener('mouseleave', this.onMouseUpCallback);
    this.canvasState.canvas.addEventListener('mousedown', this.onMouseDownCallback);
  }
}

export default Tool;
