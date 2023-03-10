import type Shape from '../Shape';
import type Command from './Command';
import type DiagramState from '../../components/CanvasState';

class DrawCommand implements Command {
    private readonly shape: Shape;
    private readonly canvas: DiagramState;

    constructor(shape: Shape) {
        this.shape = shape;
        this.canvas = shape.canvasState;
    }

    execute(): void {
        this.canvas.addShape(this.shape);
    }

    undo() {
        this.canvas.removeShape(this.shape);
    }
}

export default DrawCommand;
