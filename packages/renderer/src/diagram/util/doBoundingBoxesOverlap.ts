import type { Point } from '../shapes/Freehand';
import type { BoundingBox } from '../shapes/Shape';
import isPointInsideBoundingBox from './isPointInsideBoundingBox';

const doBoundingBoxesOverlap = (boundingBoxA: BoundingBox, boundingBoxB: BoundingBox): boolean => {
  const { topLeft, bottomRight } = boundingBoxA;
  const cornersA: Point[] = [topLeft, { x: topLeft.x, y: bottomRight.y }, bottomRight, { x: bottomRight.x, y: topLeft.y }];
  const cornersB: Point[] = [topLeft, { x: topLeft.x, y: bottomRight.y }, bottomRight, { x: bottomRight.x, y: topLeft.y }];

  return corners.some((corner) => isPointInsideBoundingBox(corner, boundingBoxB));
};

export default doBoundingBoxesOverlap;
