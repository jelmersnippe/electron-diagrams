import type { ToolboxConfiguration } from '..';
import type DiagramState from '../../CanvasState';
import Tool from './Tool';
import type { ShapeType } from '/@/diagram/shapes/Freehand';
import { createShape } from '/@/diagram/shapes/Freehand';
import type Shape from '/@/diagram/shapes/Shape';

class DrawTool extends Tool {
  private shape: Shape | null = null;
  private shapeType: ShapeType;
  private configuration: ToolboxConfiguration;

  constructor(canvasState: DiagramState, shapeType: ShapeType, configuration: ToolboxConfiguration) {
    super(canvasState);
    this.shapeType = shapeType;
    this.configuration = configuration;
  }

  start(data: MouseEvent): void {
    this.shape = createShape(this.shapeType, this.canvasState, this.configuration);
    this.shape.start(data);
  }
  move(data: MouseEvent): void {
    if (!this.shape) {
      console.error('No shape created while already in move event of DrawCommand');
      return;
    }
    this.shape.draw(data);
  }
  finish(data: MouseEvent): void {
    if (!this.shape) {
      console.error('No shape created while already in finish event of DrawCommand');
      return;
    }
    const resultCommand = this.shape.finish(data);
    this.canvasState.executeCommand(resultCommand);
  }
}

export default DrawTool;
