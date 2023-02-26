import type Shape from '../Shape';
import type Command from './Command';

class DrawCommand implements Command {
    private readonly shape: Shape;
    private readonly canvas: Canvas;
    
    constructor(shape: Shape) {
        this.shape = shape;
    }

    execute(): void {
        this.shape.redo();
    }

    undo() {
        throw 'Can\'t undo a draw command directly, pop it from the history instead';
    }
}

export default DrawCommand;
