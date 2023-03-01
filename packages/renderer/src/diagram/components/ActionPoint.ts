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
    super(canvasState);
    this.area = area;
    this.canvasState = canvasState;
  }
}

