import type { ActionPoint } from '../components/ActionPoint';
import BoundingBox from '../util/BoundingBox';
import type Command from './commands/Command';
import type { Point } from './Freehand';
import Shape from './Shape';

class Connection extends Shape {
    actionPoints: (() => ActionPoint)[] = [];
    private startPoint: Point = {x: 0, y: 0};
    private endPoint: Point = {x: 0, y: 0};
    start(data: Point) {
      this.setup();

        const { x, y } = data;
        this.startPoint = {x, y};
        this.draw(data);
    }
    redo(){
      this.setup();

      this.draw(this.endPoint);
    }
    draw(event: Point): void {
      this.canvasState.context.lineWidth = 2;
      this.canvasState.context.strokeStyle = '#000';
      this.canvasState.context.setLineDash([]);
      this.canvasState.context.beginPath();
      this.canvasState.context.moveTo(this.startPoint.x, this.startPoint.y);
      this.canvasState.context.lineTo(event.x, event.y);
      this.canvasState.context.stroke();
    }
    finish(data: Point): Command {
        const { x, y } = data;
        this.endPoint = { x, y };
        return super.finish(data);
    }
    setBoundingBox(): void {
      this.boundingBox = new BoundingBox(this.startPoint, this.endPoint);
      //
    }
    move(offset: Point): void {
      this.startPoint = {x: this.startPoint.x + offset.x, y: this.startPoint.y + offset.y};
      this.endPoint = {x: this.endPoint.x + offset.x, y: this.endPoint.y + offset.y};
      this.setBoundingBox();
    }
}

export default Connection;
