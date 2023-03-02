import type { ToolboxConfiguration } from '../components/Toolbox';
import applyToolboxConfiguration from '../util/applyToolboxConfiguration';
import DrawCommand from './commands/DrawCommand';
import type DiagramState from '../components/CanvasState';
import type Command from './commands/Command';
import type BoundingBox from '../util/BoundingBox';
import type { Point } from './Freehand';

export default abstract class Shape {
    cursorType = 'crosshair';
    configuration: ToolboxConfiguration;
    boundingBox: BoundingBox | null = null;
    boundingBoxPadding = 5;

    canvasState: DiagramState;

    constructor(canvasState: DiagramState, configuration: ToolboxConfiguration) {
        this.canvasState = canvasState;
        this.configuration = configuration;
    }

    private setup() {
        applyToolboxConfiguration(this.canvasState.context, this.configuration);
    }

    redo() {
        this.setup();
    }

    start(_event: MouseEvent) {
        this.setup();
    }

    finish(_event: MouseEvent): Command {
        this.setBoundingBox();

        return new DrawCommand(this, this.canvasState);
    }

    abstract draw(event: MouseEvent): void
    abstract setBoundingBox(): void
    abstract move(offset: Point): void;
}
