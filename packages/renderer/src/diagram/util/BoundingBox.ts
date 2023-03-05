import type { BoundingBoxSide } from '../components/ConnectionActionPoint';
import Point from './Point';

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

    this.topLeft = new Point(minX, minY);
    this.topRight = new Point(maxX, minY);
    this.bottomLeft = new Point(minX, maxY);
    this.bottomRight = new Point(maxX, maxY);

    this.width = maxX - minX;
    this.height = maxY - minY;

    this.center = new Point(minX + (this.width / 2), minY + (this.height / 2));
    this.top = new Point(this.center.x, minY);
    this.bottom = new Point(this.center.x, maxY);
    this.left = new Point(minX, this.center.y);
    this.right = new Point(maxX, this.center.y);
  }

  overlapsWith(boundingBox: BoundingBox): boolean {
    return [this.topLeft, this.topRight, this.bottomLeft, this.bottomRight].some((corner) => boundingBox.contains(corner)) ||
      [boundingBox.topLeft, boundingBox.topRight, boundingBox.bottomLeft, boundingBox.bottomRight].some((corner) => this.contains(corner));
  }

  contains(point: Point): boolean {
    return point.x >= this.topLeft.x && point.x <= this.bottomRight.x
      && point.y >= this.topLeft.y && point.y <= this.bottomRight.y;
  }

  getClosestSide(point: Point): BoundingBoxSide {
    let closestPoint: BoundingBoxSide = 'top';
    let minDistance = Infinity;
    for (const direction of ['top', 'left', 'right', 'bottom'] as const) {
      const xDiff = point.x - this[direction].x;
      const yDiff = point.y - this[direction].y;

      const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
      if (distance <= minDistance) {
        minDistance = distance;
        closestPoint = direction;
      }
    }
    return closestPoint;
  }
}

export default BoundingBox;
