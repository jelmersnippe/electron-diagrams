import type Command from '../shapes/commands/Command';
import type Shape from '../shapes/Shape';

class Canvas {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
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

    constructor(canvas: HTMLCanvasElement) {
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('No 2d context attached to canvas');
        }

        this.canvas = canvas;
        this.context = context;
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
    }

    undo() {
        if (this.commandIndex < 0 || this.commandIndex >= history.length) {
            throw new Error('Command index is out of range of the history');
        }

        const command = this.history[this.commandIndex];
        command.undo();
        this.commandIndex--;

        this.draw();
    }

    redo() {
        if (this.commandIndex < 0 || this.commandIndex >= history.length) {
            throw new Error('Command index is out of range of the history');
        }
        if (this.commandIndex === history.length - 1) {
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
        this.history.push(command);
        this.commandIndex++;

        this.draw();
    }
}

export default Canvas;
