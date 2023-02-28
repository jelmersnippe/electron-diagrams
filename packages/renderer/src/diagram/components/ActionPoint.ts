import type { Point } from '../shapes/Freehand';
import type Shape from '../shapes/Shape';
import type BoundingBox from '../util/BoundingBox';
import MouseInteractible from '../util/MouseInteractible';

export type ActionPointType = 'move';
export const actionPointCursorMapping: Record<ActionPointType, string> = {
  move: 'move',
};

export abstract class ActionPoint extends MouseInteractible {
  abstract type: ActionPointType;
  area: BoundingBox;

  constructor(area: BoundingBox, canvas: HTMLCanvasElement) {
    super(canvas);
    this.area = area;
  }

  deregister() {
    super.deregister();
  }

  protected canStart(data: MouseEvent): boolean {
    if (!super.canStart(data)) {
      return false;
    }

    if (!this.area.contains(data)) {
      return false;
    }

    return true;
  }
}

export class MoveActionPoint extends ActionPoint {
  type: ActionPointType = 'move';
  shape: Shape;
  private previousPoint: Point = {x: 0, y: 0};

  constructor(area: BoundingBox, canvas: HTMLCanvasElement, shape: Shape) {
    super(area, canvas);
    this.shape = shape;
  }

  start(data: MouseEvent): void {
    // TODO: disable active tool;
    const {x,y} = data;
    this.previousPoint = {x, y};
  }

  move(data: MouseEvent): void {
    const {x, y} = data;
    this.shape.move({x: x - this.previousPoint.x, y: y - this.previousPoint.y});
    this.previousPoint = {x,y};
  }

  finish(_data: MouseEvent): void {
    // TODO: enable active tool;
    // TODO: Create command for the DiagramState history
  }
}
