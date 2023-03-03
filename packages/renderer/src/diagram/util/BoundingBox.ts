import type { Point } from '../shapes/Freehand';

class BoundingBox {
  readonly topLeft: Point;
  readonly topRight: Point;
  readonly bottomLeft: Point;
  readonly bottomRight: Point;
  readonly width: number;
  readonly height: number;

  readonly center: Point;
  readonly top: Point;
  readonly bottom: Point;
  readonly left: Point;
  readonly right: Point;


  constructor(pointA: Point, pointB: Point) {
    const minX = Math.min(pointA.x, pointB.x);
    const maxX = Math.max(pointA.x, pointB.x);
    const minY = Math.min(pointA.y, pointB.y);
    const maxY = Math.max(pointA.y, pointB.y);

    this.topLeft = { x: minX, y: minY };
    this.topRight = { x: maxX, y: minY };
    this.bottomLeft = { x: minX, y: maxY };
    this.bottomRight = { x: maxX, y: maxY };

    this.width = maxX - minX;
    this.height = maxY - minY;

    this.center = {x: minX + (this.width / 2), y: minY + (this.height / 2)};
    this.top = {x: this.center.x, y: minY};
    this.bottom = {x: this.center.x, y: maxY};
    this.left = {x: minX, y: this.center.y};
    this.right = {x: maxX, y: this.center.y};
  }

  overlapsWith(boundingBox: BoundingBox): boolean {
    return [this.topLeft, this.topRight, this.bottomLeft, this.bottomRight].some((corner) => boundingBox.contains(corner)) ||
      [boundingBox.topLeft, boundingBox.topRight, boundingBox.bottomLeft, boundingBox.bottomRight].some((corner) => this.contains(corner));
  }

  contains(point: Point): boolean {
    return point.x >= this.topLeft.x && point.x <= this.bottomRight.x
      && point.y >= this.topLeft.y && point.y <= this.bottomRight.y;
  }

  getClosestSide(data: MouseEvent): Point {
    let closestPoint: Point = this.top;
    let minDistance = Infinity;
    for (const direction of ['top', 'left', 'right', 'bottom'] as const) {
      const xDiff = data.x - this[direction].x;
      const yDiff = data.y - this[direction].y;

      const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
      if (distance <= minDistance) {
        minDistance = distance;
        closestPoint = this[direction];
      }
    }
    return closestPoint;
  }
}

export default BoundingBox;
