import type Command from '../shapes/commands/Command';
import type Shape from '../shapes/Shape';
import type BoundingBox from '../util/BoundingBox';
import type { ActionPoint} from './ActionPoint';
import { actionPointCursorMapping, MoveActionPoint } from './ActionPoint';

class DiagramState {
  private _canvas: HTMLCanvasElement;
  get canvas(): HTMLCanvasElement {
    return this._canvas;
  }
  private _context: CanvasRenderingContext2D;
  get context(): CanvasRenderingContext2D {
    return this._context;
  }
  private shapes: Shape[] = [];
  private history: Command[] = [];
  private _commandIndex = -1;
  private set commandIndex(value: number) {
    this._commandIndex = value;
  }
  get commandIndex(): number {
    if (this._commandIndex < -1) {
      this._commandIndex = -1;
    }
    else if (this._commandIndex >= this.history.length) {
      this._commandIndex = this.history.length - 1;
    }

    return this._commandIndex;
  }
  private _actionPoints: ActionPoint[] = [];
  private set actionPoints(value: ActionPoint[]) {
    for (const actionPoint of this._actionPoints) {
      actionPoint.deregister();
    }
    this._actionPoints = value;
  }
  private get actionPoints(): ActionPoint[] {
    return this._actionPoints;
  }
  selectedShapes: Shape[] = [];

  constructor(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('No 2d context attached to canvas');
    }

    this._canvas = canvas;
    this._context = context;
    canvas.addEventListener('mousemove', this.actionPointHoverCallback);
  }

  private actionPointHoverCallback = this.handleActionPointHover.bind(this);
  private handleActionPointHover(data: MouseEvent) {
    const { x, y } = data;
    for (const actionPoint of this.actionPoints) {
      if (actionPoint.area.contains({ x, y })) {
        this.canvas.style.cursor = actionPointCursorMapping[actionPoint.type];
        return;
      }
    }
    this.canvas.style.cursor = 'default';
  }

  selectShapesWithinBoundingBox(boundingBox: BoundingBox): Shape[] {
    // Reverse the list so the latest shapes will appear on top
    this.selectedShapes = this.shapes.filter((shape) => shape.boundingBox?.overlapsWith(boundingBox)).reverse();

    this.draw();

    this.actionPoints = [];
    for (const shape of this.selectedShapes) {
      if (!shape.boundingBox) {
        continue;
      }

      this.actionPoints.push(new MoveActionPoint(shape.boundingBox, this.canvas, shape));
    }

    return this.selectedShapes;
  }

  addShape(shape: Shape) {
    this.shapes.push(shape);
  }

  removeShape(shape: Shape) {
    const index = this.shapes.indexOf(shape);
    if (index >= 0) {
      this.shapes.splice(index, 1);
    }
  }

  draw() {
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    // All shapes should be in their correct state due to the history, so we can simply draw all shapes
    for (const shape of this.shapes) {
      shape.redo();
    }
    for (const shape of this.selectedShapes) {
      shape.drawBoundingBox();
    }
  }

  undo() {
    if (this.commandIndex < 0 || this.commandIndex >= this.history.length) {
      console.warn('Either out of bounds of the array or already undid the first command');
      return;
    }

    const command = this.history[this.commandIndex];
    command.undo();
    this.commandIndex--;

    this.draw();
  }

  redo() {
    if (this.commandIndex < -1 || this.commandIndex >= this.history.length) {
      throw new Error('Command index is out of range of the history');
    }
    if (this.commandIndex === this.history.length - 1) {
      console.warn('Already at latest change');
      return;
    }

    const nextCommandIndex = this.commandIndex + 1;
    const command = this.history[nextCommandIndex];
    command.execute();

    this.commandIndex++;

    this.draw();
  }

  executeCommand(command: Command) {
    command.execute();

    // We are not at the head of our history, so we have to discard all 'future' commands
    if (this.commandIndex !== this.history.length - 1) {
      this.history.splice(this.commandIndex + 1);
    }
    this.commandIndex = this.history.push(command) - 1;

    this.draw();
  }
}

export default DiagramState;
