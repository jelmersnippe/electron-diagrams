import type DiagramState from '../components/CanvasState';
import throttle from 'lodash.throttle';
import Point from './Point';

const ACTIONS_PER_SECOND = 60;
abstract class MouseInteractible {
  abstract start(point: Point): void;
  abstract move(data: Point): void;
  abstract finish(point: Point): void;

  protected canvasState: DiagramState;

  private onMouseUpCallback = this.onMouseUp.bind(this);
  private onMouseMoveCallback = throttle(this.onMouseMove.bind(this), 1000 / ACTIONS_PER_SECOND);

  constructor(canvasState: DiagramState) {
    this.canvasState = canvasState;
  }

  onMouseDown(data: MouseEvent) {
    this.canvasState.interactingWithActionPoint = true;

    this.canvasState.canvas.addEventListener('mouseleave', this.onMouseUpCallback);
    this.canvasState.canvas.addEventListener('mouseup', this.onMouseUpCallback);
    this.canvasState.canvas.addEventListener('mousemove', this.onMouseMoveCallback);
    this.start(new Point(data.x, data.y));
  }

  private onMouseMove(data: MouseEvent) {
    this.move(new Point(data.x, data.y));
  }

  private onMouseUp(data: MouseEvent) {
    const leftMouseButtonDown = data.buttons % 2 !== 0;
    if (data.type !== 'mouseleave' && leftMouseButtonDown) {
      return;
    }

    this.canvasState.interactingWithActionPoint = false;

    this.finish(new Point(data.x, data.y));
    this.canvasState.canvas.removeEventListener('mousemove', this.onMouseMoveCallback);
    this.canvasState.canvas.removeEventListener('mouseup', this.onMouseUpCallback);
    this.canvasState.canvas.removeEventListener('mouseleave', this.onMouseUpCallback);
  }
}

export default MouseInteractible;

