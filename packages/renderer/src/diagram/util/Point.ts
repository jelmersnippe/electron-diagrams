class Point {
  readonly x: number;
  readonly y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(point: Point) {
    return new Point(this.x + point.x, this.y + point.y);
  }

  subtract(point: Point) {
    return this.add(new Point(-point.x, -point.y));
  }

  multiply(point: Point) {
    return new Point(this.x * point.x, this.y * point.y);
  }

  inverse() {
    return new Point(this.y, this.x);
  }

  opposite() {
    return this.multiply(new Point(-1, -1));
  }

  isInLineWith(point: Point): boolean {
    return this.x === point.x || this.y === point.y;
  }
}

export default Point;
