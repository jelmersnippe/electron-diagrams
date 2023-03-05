import type Command from '../shapes/commands/Command';
import type Shape from '../shapes/Shape';
import type BoundingBox from '../util/BoundingBox';
import Point from '../util/Point';
import type { ActionPoint } from './ActionPoint';
import MoveActionPoint from './MoveActionPoint';
import SelectTool from './Toolbox/tools/SelectTool';
import type Tool from './Toolbox/tools/Tool';

class DiagramState {
  private _canvas: HTMLCanvasElement;
  get canvas(): HTMLCanvasElement {
    return this._canvas;
  }
  private _context: CanvasRenderingContext2D;
  get context(): CanvasRenderingContext2D {
    return this._context;
  }
  shapes: Shape[] = [];
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
  private actionPoints: ActionPoint[] = [];
  private _selectedShapes: Shape[] = [];
  get selectedShapes(): Shape[] {
    return this._selectedShapes;
  }
  set selectedShapes(shapes: Shape[]) {
    this._selectedShapes = shapes;
    this.draw();
  }
  interactingWithActionPoint = false;
  currentTool: Tool = new SelectTool(this);

  constructor(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('No 2d context attached to canvas');
    }

    this._canvas = canvas;
    this._context = context;
    canvas.addEventListener('mousedown', this.mouseDownCallback);
  }

  deregister() {
    this.canvas.removeEventListener('mousedown', this.mouseDownCallback);
  }

  private mouseDownCallback = this.mouseDown.bind(this);
  private mouseDown(data: MouseEvent) {
    const point = new Point(data.x, data.y);
    if (this.interactingWithActionPoint) {
      return;
    }

    const leftMouseButtonDown = data.buttons % 2 !== 0;
    if (!leftMouseButtonDown) {
      return;
    }

    for (const actionPoint of this.actionPoints) {
      if (actionPoint.area.contains(point)) {
        actionPoint.onMouseDown(data);
        return;
      }
    }

    for (const shape of [...this.shapes].reverse()) {
      if (shape.boundingBox?.contains(point)) {
        this.selectedShapes = [shape];
        return;
      }
    }

    this.currentTool.onMouseDown(data);
  }

  selectShapesWithinBoundingBox(boundingBox: BoundingBox) {
    // Reverse the list so the latest shapes will appear on top
    this.selectedShapes = this.shapes.filter((shape) => shape.boundingBox?.overlapsWith(boundingBox)).reverse();
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

    this.actionPoints = [];
    // All shapes should be in their correct state due to the history, so we can simply draw all shapes
    for (const shape of this.shapes) {
      shape.redo();
      for (const actionPoint of shape.actionPoints) {
        this.actionPoints.push(actionPoint());
      }
    }
    for (const shape of this.selectedShapes) {
      this.actionPoints.push(new MoveActionPoint(shape.boundingBox, this));
    }

    for (const actionPoint of this.actionPoints) {
      actionPoint.draw();
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

    // Updating selectedShapes triggers a draw
    this.selectedShapes = [];
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

    // Updating selectedShapes triggers a draw
    this.selectedShapes = [];
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
