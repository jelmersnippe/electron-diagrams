import BoundingBox from '../util/BoundingBox';
import Point from '../util/Point';
import type Command from './commands/Command';
import Shape from './Shape';

abstract class PredefinedShape extends Shape {
  protected abstract minWidth: number;
  protected abstract minHeight: number;
  protected initialPoint: Point | null = null;
  protected finalPoint: Point | null = null;

  start(point: Point) {
    this.setup();
    this.initialPoint = point;
  }

  draw(point: Point) {
    this.finalPoint = point;
    this.setBoundingBox();
  }

  finish(point: Point): Command {
    this.finalPoint = point;

    return super.finish(point);
  }

  redo() {
    this.setup();
    this.printShape();
  }

  setBoundingBox() {
    if (!this.initialPoint || !this.finalPoint) {
      throw new Error('Tried to set bounding box for predefined shape without two points set');
    }

    const width = this.finalPoint.x - this.initialPoint.x;
    const height = this.finalPoint.y - this.initialPoint.y;
    const correctedFinalPoint = new Point(
      Math.abs(width) >= this.minWidth ? this.initialPoint.x + width : this.initialPoint.x + (width === 0 ? this.minWidth : Math.sign(width) * this.minWidth),
      Math.abs(height) >= this.minHeight ? this.initialPoint.y + height : this.initialPoint.y + (height === 0 ? this.minHeight : Math.sign(height) * this.minHeight),
    );

    this.boundingBox = new BoundingBox(this.initialPoint, correctedFinalPoint);
    this.canvasState.draw();
    this.printShape();
  }

  move(offset: Point) {
    if (!this.boundingBox) {
      throw new Error('Tried to move a PredefinedShape without a set bounding box');
    }

    const { topLeft, bottomRight } = this.boundingBox;
    this.boundingBox = new BoundingBox(topLeft.add(offset), bottomRight.add(offset));
  }

  abstract printShape(): void;
}

export default PredefinedShape;
