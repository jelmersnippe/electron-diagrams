import type { Point } from '../shapes/Freehand';

class BoundingBox {
  readonly topLeft: Point;
  readonly topRight: Point;
  readonly bottomLeft: Point;
  readonly bottomRight: Point;
  readonly center: Point;

  constructor(pointA: Point, pointB: Point) {
    const minX = Math.min(pointA.x, pointB.x);
    const maxX = Math.max(pointA.x, pointB.x);
    const minY = Math.min(pointA.y, pointB.y);
    const maxY = Math.max(pointA.y, pointB.y);
    this.topLeft = { x: minX, y: minY };
    this.topRight = { x: maxX, y: minY };
    this.bottomLeft = { x: minX, y: maxY };
    this.bottomRight = { x: maxX, y: maxY };
    this.center = {x: maxX - minX, y: maxY - minY};
  }

  overlapsWith(boundingBox: BoundingBox): boolean {
    return [this.topLeft, this.topRight, this.bottomLeft, this.bottomRight].some((corner) => boundingBox.contains(corner)) ||
      [boundingBox.topLeft, boundingBox.topRight, boundingBox.bottomLeft, boundingBox.bottomRight].some((corner) => this.contains(corner));
  }

  contains(point: Point): boolean {
    return point.x >= this.topLeft.x && point.x <= this.bottomRight.x
      && point.y >= this.topLeft.y && point.y <= this.bottomRight.y;
  }
}

export default BoundingBox;
