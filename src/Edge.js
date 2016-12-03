import * as vertex from "./Vertex.js";

const EPSILON = vertex.EPSILON;

export class Edge {

  constructor(points) {
    this._a = new vertex.Vertex(points[0][0], points[0][1]);
    this._b = new vertex.Vertex(points[1][0], points[1][1]);
  }

  slope() {
    return (this._b.y - this._a.y)/(this._b.x - this._a.x);
  }

  vertices() {
    return [this._a, this._b];
  }

  interceptY() {
    return this._a.y - (this.slope() * this._a.x);
  }

  left() {
    return (this._a.x < this._b.x) ? this._a : this._b;
  }

  right() {
    return (this._a.x < this._b.x) ? this._b : this._a;
  }

  top() {
    return (this._a.y < this._b.y) ? this._b : this._a;
  }

  bottom() {
    return (this._a.y < this._b.y) ? this._a : this._b;
  }

}

export function intersect(e0, e1) {
  // If any of the edge vertices as the same, these edges cannot intersect.
  if (sharedVertices(e0, e1)) {
    return false;
  }
  // Find the slope of the lines.
  const m0 = e0.slope(), m1 = e1.slope();
  // If the slopes are the same, these edges cannot intersect.
  if (Math.abs(m1 - m0) <= EPSILON) {
    return false;
  }
  // Find the y-intercepts of the lines.
  const b0 = e0.interceptY(), b1 = e1.interceptY();
  // Find the x intersection.
  const x = (b1 - b0)/(m0 - m1);
  // Find the y intersection.
  const y = m0 * x + b0;
  // Define a vertex at the point (x,y).
  const intersection = new vertex.Vertex(x, y);
  // Now determine if (x,y) falls within the bounding box of e0.
  return withinBounds(e0, intersection);
}

function withinBounds(edge, v) {
  return (
    (edge.left().x < v.x && v.x < edge.right().x)
    && (edge.bottom().y < v.y && v.y < edge.top().y)
  );
}

function sharedVertices(e0, e1) {
  const v0 = e0.left(), v1 = e0.right(), v2 = e1.left(), v3 = e1.right();
  return (
    vertex.same(v0, v1)
    || vertex.same(v0, v2)
    || vertex.same(v0, v3)
    || vertex.same(v1, v2)
    || vertex.same(v1, v3)
    || vertex.same(v2, v3)
  );
}
