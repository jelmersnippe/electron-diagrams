import type Shape from '../Shape';
import type Command from './Command';
import type CanvasState from '../../components/CanvasState';

class DrawCommand implements Command {
    private readonly shape: Shape;
    private readonly canvas: CanvasState;
    
    constructor(shape: Shape, canvas: CanvasState) {
        this.shape = shape;
        this.canvas = canvas;
    }

    execute(): void {
        this.canvas.addShape(this.shape);
    }

    undo() {
        this.canvas.removeShape(this.shape);
    }
}

export default DrawCommand;
