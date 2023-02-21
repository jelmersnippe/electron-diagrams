class Freehand {
    canvas: HTMLCanvasElement;
    cursorType = 'crosshair';
    context: CanvasRenderingContext2D;
    prevPoint: [number, number] | null = null;
    drawing = false;
    mouseMoveCallback = this.draw.bind(this);

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const context = canvas.getContext('2d');
        if (context === null) {
            throw 'No 2D context found on passed canvas';
        }
        this.context = context;
    }

    init(data: MouseEvent) {
        if (this.drawing) {
            console.warn('Tried to start drawing on shape that was already drawing');
            return;
        }
        this.context.lineJoin = 'round';
        this.context.lineCap = 'round';
        this.context.strokeStyle = 'black';
        this.canvas.style.cursor = 'crosshair';
        this.drawing = true;
        this.canvas.addEventListener('mousemove', this.mouseMoveCallback);
    }

    draw(data: MouseEvent) {
        if (!this.drawing){
            console.warn('Tried to call draw on a shape that is not drawing');
            return;
        }
        const { x, y } = data;
        if (this.prevPoint !== null) {
            this.context.beginPath();
            this.context.moveTo(this.prevPoint[0], this.prevPoint[1]);
            this.context.lineTo(x, y);
            this.context.stroke();
        }

        this.prevPoint = [x, y];
    }

    finish(data: MouseEvent) {
        if (!this.drawing) {
            console.warn('Tried to finish drawing on shape that was not drawing');
            return;
        }
        document.body.style.cursor = 'default';
        this.canvas.removeEventListener('mousemove', this.mouseMoveCallback);
        this.drawing = false;
    }
}

export type ShapeType = 'freehand';
export const createShape = (type: ShapeType, canvas: HTMLCanvasElement): Freehand => {
    switch (type) {
        case 'freehand':
            return new Freehand(canvas);
    }
};

export default Freehand;
