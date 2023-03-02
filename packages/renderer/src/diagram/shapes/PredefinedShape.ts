import BoundingBox from '../util/BoundingBox';
import type Command from './commands/Command';
import type { Point } from './Freehand';
import Shape from './Shape';

abstract class PredefinedShape extends Shape {
  protected abstract minWidth: number;
  protected abstract minHeight: number;
  protected initialPoint: Point | null = null;
  protected finalPoint: Point | null = null;

  start(data: MouseEvent) {
    super.start(data);
    const {x, y} = data;
    this.initialPoint = {x, y};
  }

  draw(data: MouseEvent) {
    const {x, y} = data;
    this.finalPoint = {x, y};
    this.setBoundingBox();
  }

  finish(data: MouseEvent): Command {
    const {x, y} = data;
    this.finalPoint = {x, y};

    return super.finish(data);
  }

  redo() {
    super.redo();
    this.printShape();
  }

  setBoundingBox() {
    if (!this.initialPoint || !this.finalPoint) {
      throw new Error('Tried to set bounding box for predefined shape without two points set');
    }

    const correctedFinalPoint = this.finalPoint;
    const width = this.finalPoint.x - this.initialPoint.x;
    const height = this.finalPoint.y - this.initialPoint.y;
    if (Math.abs(width) < this.minWidth) {
      correctedFinalPoint.x = this.initialPoint.x + (width === 0 ? this.minWidth : Math.sign(width) * this.minWidth);
    }
    if (Math.abs(height) < this.minHeight) {
      correctedFinalPoint.y = this.initialPoint.y + (height === 0 ? this.minHeight : Math.sign(height) * this.minHeight);
    }

    this.boundingBox = new BoundingBox(this.initialPoint, correctedFinalPoint);
    this.canvasState.draw();
    this.printShape();
  }

  move(offset: Point) {
    if (!this.boundingBox) {
      throw new Error('Tried to move a PredefinedShape without a set bounding box');
    }

    const {topLeft, bottomRight} = this.boundingBox;
    this.boundingBox = new BoundingBox({x: topLeft.x + offset.x, y: topLeft.y + offset.y}, {x: bottomRight.x + offset.x, y: bottomRight.y + offset.y});
  }

  abstract printShape(): void;
}

export default PredefinedShape;
