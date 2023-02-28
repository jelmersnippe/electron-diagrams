import type { Point } from '../shapes/Freehand';
import type Shape from '../shapes/Shape';
import type BoundingBox from '../util/BoundingBox';
import MouseInteractible from '../util/MouseInteractible';
import type DiagramState from './CanvasState';

export type ActionPointType = 'move';
export const actionPointCursorMapping: Record<ActionPointType, string> = {
  move: 'move',
};

export abstract class ActionPoint extends MouseInteractible {
  abstract type: ActionPointType;
  area: BoundingBox;
  canvasState: DiagramState;

  constructor(area: BoundingBox, canvasState: DiagramState) {
    super(canvasState.canvas);
    this.area = area;
    this.canvasState = canvasState;
  }

  deregister() {
    super.deregister();
  }

  protected canStart(data: MouseEvent): boolean {
    return super.canStart(data) && this.area.contains(data);
  }
}

export class MoveActionPoint extends ActionPoint {
  type: ActionPointType = 'move';
  private previousPoint: Point = {x: 0, y: 0};

  start(data: MouseEvent): void {
    this.canvasState.interactingWithActionPoint = true;
    const {x,y} = data;
    this.previousPoint = {x, y};
  }

  move(data: MouseEvent): void {
    const {x, y} = data;
    for (const shape of this.canvasState.selectedShapes) {
      shape.move({x: x - this.previousPoint.x, y: y - this.previousPoint.y});
    }
    this.previousPoint = {x,y};
  }

  finish(_data: MouseEvent): void {
    this.canvasState.interactingWithActionPoint = false;
    // TODO: Create command for the DiagramState history
    // Probably just revert all the shapes positions and then call executeCommand so it happens again
    // Or create a method that only pushes a command without executing for live edits like this
  }
}
