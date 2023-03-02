import type { ToolboxConfiguration } from '../components/Toolbox';
import applyToolboxConfiguration from '../util/applyToolboxConfiguration';
import DrawCommand from './commands/DrawCommand';
import type DiagramState from '../components/CanvasState';
import type Command from './commands/Command';
import BoundingBox from '../util/BoundingBox';
import type { Point } from './Freehand';
import type { ActionPoint } from '../components/ActionPoint';

export default abstract class Shape {
    cursorType = 'crosshair';
    configuration: ToolboxConfiguration;
    boundingBox: BoundingBox = new BoundingBox({x: 0, y: 0}, {x: 0, y: 0});
    boundingBoxPadding = 5;
    abstract actionPoints: (() => ActionPoint)[];

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

    start(_event: Point) {
        this.setup();
    }

    finish(_event: Point): Command {
        this.setBoundingBox();

        return new DrawCommand(this, this.canvasState);
    }

    abstract draw(event: Point): void
    abstract setBoundingBox(): void
    abstract move(offset: Point): void;
}
