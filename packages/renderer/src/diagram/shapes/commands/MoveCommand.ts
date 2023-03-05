import type Point from '../../util/Point';
import type Shape from '../Shape';
import type Command from './Command';

class MoveCommand implements Command {
  private readonly shapes: Shape[];
  private readonly offset: Point;

  constructor(shapes: Shape[], offset: Point) {
    this.shapes = shapes;
    this.offset = offset;
  }

  execute(): void {
    for (const shape of this.shapes) {
      shape.move(this.offset);
    }
  }

  undo() {
    for (const shape of this.shapes) {
      shape.move(this.offset.opposite());
    }
  }
}

export default MoveCommand;
