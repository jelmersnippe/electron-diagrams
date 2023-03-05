import type { ToolboxConfiguration } from '../components/Toolbox';
import applyToolboxConfiguration from '../util/applyToolboxConfiguration';
import DrawCommand from './commands/DrawCommand';
import type DiagramState from '../components/CanvasState';
import type Command from './commands/Command';
import BoundingBox from '../util/BoundingBox';
import type { ActionPoint } from '../components/ActionPoint';
import type Connection from './Connection';
import type { BoundingBoxSide } from '../components/ConnectionActionPoint';
import Point from '../util/Point';

export type ConnectionPoint = {
  location: BoundingBoxSide;
  line: Connection;
}
export default abstract class Shape {
    cursorType = 'crosshair';
    configuration: ToolboxConfiguration;
    boundingBox: BoundingBox = new BoundingBox(new Point(0,0), new Point(0,0));
    boundingBoxPadding = 5;
    abstract actionPoints: (() => ActionPoint)[];
    abstract canHaveConnections: boolean;
    connections: ConnectionPoint[] = [];

    canvasState: DiagramState;

    constructor(canvasState: DiagramState, configuration: ToolboxConfiguration) {
        this.canvasState = canvasState;
        this.configuration = configuration;
    }

    protected setup() {
        applyToolboxConfiguration(this.canvasState.context, this.configuration);
    }

    finish(_point: Point): Command {
        this.setBoundingBox();

        return new DrawCommand(this);
    }

    abstract redo(): void;
    abstract start(point: Point): void;
    abstract draw(point: Point): void
    abstract setBoundingBox(): void
    abstract move(offset: Point): void;
}
