import type { ActionPoint } from '../components/ActionPoint';
import ConnectionActionPoint from '../components/ConnectionActionPoint';
import PredefinedShape from './PredefinedShape';

class Box extends PredefinedShape {
  canHaveConnections = true;

  actionPoints: (() => ActionPoint)[] = [
    () => new ConnectionActionPoint('top', this),
    () => new ConnectionActionPoint('bottom', this),
    () => new ConnectionActionPoint('left', this),
    () => new ConnectionActionPoint('right', this),
  ];
  protected minWidth = 100;
  protected minHeight = 50;

  printShape(): void {
    if (!this.boundingBox) {
      throw new Error('Tried to draw a bounding box shape without an existing bounding box');
    }
    const { x, y } = this.boundingBox.topLeft;
    this.canvasState.context.strokeStyle = '#000';
    this.canvasState.context.lineWidth = 2;
    this.canvasState.context.strokeRect(x, y, this.boundingBox.width, this.boundingBox.height);
  }
}

export default Box;
