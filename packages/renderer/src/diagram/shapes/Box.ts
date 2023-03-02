import type { ActionPoint } from '../components/ActionPoint';
import ConnectionActionPoint from '../components/ConnectionActionPoint';
import BoundingBox from '../util/BoundingBox';
import PredefinedShape from './PredefinedShape';

class Box extends PredefinedShape {
    actionPoints: (() => ActionPoint)[] = [
      () => new ConnectionActionPoint('down', new BoundingBox(
        {x: this.boundingBox.center.x - 8, y: this.boundingBox.center.y + (this.boundingBox.height / 2)},
        {x: this.boundingBox.center.x + 8, y: this.boundingBox.center.y + (this.boundingBox.height / 2) + 30}), this.canvasState),
      () => new ConnectionActionPoint('right', new BoundingBox(
        {x: this.boundingBox.center.x + (this.boundingBox.width / 2), y: this.boundingBox.center.y - 8 },
        {x: this.boundingBox.center.x + (this.boundingBox.width / 2) + 30, y: this.boundingBox.center.y + 8}), this.canvasState),
      () => new ConnectionActionPoint('up', new BoundingBox(
        {x: this.boundingBox.center.x - 8, y: this.boundingBox.center.y - (this.boundingBox.height / 2)},
        {x: this.boundingBox.center.x + 8, y: this.boundingBox.center.y - (this.boundingBox.height / 2) - 30}), this.canvasState),
      () => new ConnectionActionPoint('left', new BoundingBox(
        {x: this.boundingBox.center.x - (this.boundingBox.width / 2), y: this.boundingBox.center.y - 8 },
        {x: this.boundingBox.center.x - (this.boundingBox.width / 2) - 30, y: this.boundingBox.center.y + 8}), this.canvasState),
    ];
    protected minWidth= 100;
    protected minHeight= 50;

    printShape(): void {
      if (!this.boundingBox) {
        throw new Error('Tried to draw a bounding box shape without an existing bounding box');
      }
      const {x, y} = this.boundingBox.topLeft;
      this.canvasState.context.strokeStyle = '#000';
      this.canvasState.context.lineWidth = 2;
      this.canvasState.context.strokeRect(x, y, this.boundingBox.width, this.boundingBox.height);
    }
}

export default Box;
