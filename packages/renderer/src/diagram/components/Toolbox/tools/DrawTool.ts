import type { ToolboxConfiguration } from '..';
import type DiagramState from '../../CanvasState';
import Tool from './Tool';
import type { ShapeType } from '/@/diagram/shapes/Freehand';
import { createShape } from '/@/diagram/shapes/Freehand';
import type Shape from '/@/diagram/shapes/Shape';
import Point from '/@/diagram/util/Point';

class DrawTool extends Tool {
  private shape: Shape | null = null;
  private shapeType: ShapeType;
  private configuration: ToolboxConfiguration;

  constructor(canvasState: DiagramState, shapeType: ShapeType, configuration: ToolboxConfiguration) {
    super(canvasState);
    this.shapeType = shapeType;
    this.configuration = configuration;
  }

  start(point: Point): void {
    this.shape = createShape(this.shapeType, this.canvasState, this.configuration);
    this.shape.start(point);
  }
  move(point: Point): void {
    if (!this.shape) {
      console.error('No shape created while already in move event of DrawCommand');
      return;
    }
    this.shape.draw(point);
  }
  finish(point: Point): void {
    if (!this.shape) {
      console.error('No shape created while already in finish event of DrawCommand');
      return;
    }
    const resultCommand = this.shape.finish(point);
    this.canvasState.executeCommand(resultCommand);
  }
}

export default DrawTool;
