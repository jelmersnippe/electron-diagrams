abstract class MouseInteractible {
  abstract start(data: MouseEvent): void;
  abstract move(data: MouseEvent): void;
  abstract finish(data: MouseEvent): void;

  protected canvas: HTMLCanvasElement;
  protected started = false;

  private onMouseDownCallback = this.onMouseDown.bind(this);
  private onMouseUpCallback = this.onMouseUp.bind(this);
  private onMouseMoveCallback = this.move.bind(this);

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvas.addEventListener('mousedown', this.onMouseDownCallback);
  }

  deregister() {
    this.canvas.removeEventListener('mousedown', this.onMouseDownCallback);
    this.canvas.removeEventListener('mouseleave', this.onMouseUpCallback);
    this.canvas.removeEventListener('mouseup', this.onMouseUpCallback);
    this.canvas.removeEventListener('mousemove', this.onMouseMoveCallback);
  }

  protected canStart(data: MouseEvent): boolean {
    if (this.started) {
      return false;
    }
    const leftMouseButtonDown = data.buttons % 2 !== 0;
    if (!leftMouseButtonDown) {
      return false;
    }

    return true;
  }

  private onMouseDown(data: MouseEvent) {
    if (!this.canStart(data)){
       return;
    }

    this.started = true;

    this.canvas.removeEventListener('mousedown', this.onMouseDownCallback);
    this.canvas.addEventListener('mouseleave', this.onMouseUpCallback);
    this.canvas.addEventListener('mouseup', this.onMouseUpCallback);
    this.canvas.addEventListener('mousemove', this.onMouseMoveCallback);
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
    this.canvas.removeEventListener('mousemove', this.onMouseMoveCallback);
    this.canvas.removeEventListener('mouseup', this.onMouseUpCallback);
    this.canvas.removeEventListener('mouseleave', this.onMouseUpCallback);
    this.canvas.addEventListener('mousedown', this.onMouseDownCallback);
  }
}

export default MouseInteractible;

