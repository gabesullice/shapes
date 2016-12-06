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

  yIntercept() {
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

export function same(e0, e1) {
  const v0 = e0.left(), v1 = e0.right(), v2 = e1.left(), v3 = e1.right();
  return (
    vertex.same(v0, v2)
    && vertex.same(v1, v3)
  );
}

export function intersect(e0, e1) {
  // If any of the edge vertices as the same, these edges cannot intersect.
  if (sharedVertices(e0, e1)) {
    return false;
  }
  // Find the slope of the lines.
  const m0 = e0.slope(), m1 = e1.slope();
  // If the slopes are the same, these edges cannot intersect.
  // Using atan() to convert slope of Infinity into something we can use.
  if (Math.abs(Math.atan(m1) - Math.atan(m0)) <= EPSILON) {
    return false;
  }
  // If either slope is Infinity, we can skip some work.
  let x, y;
  if (Math.abs(m0) == Infinity ^ Math.abs(m1) == Infinity) {
    x = (Math.abs(m0) == Infinity) ? e0.left().x : e1.left().x;
    y = (Math.abs(m0) == Infinity) ? m1 * x + e1.yIntercept() : m0 * x + e0.yIntercept();
  } else {
    // Find the y-intercepts of the lines.
    const b0 = e0.yIntercept(), b1 = e1.yIntercept();
    // Find the x intersection.
    x = (b1 - b0)/(m0 - m1);
    // Find the y intersection.
    y = m0 * x + b0;
  }
  // Define a vertex at the point (x,y).
  const intersection = new vertex.Vertex(x, y);
  // Now determine if (x,y) falls within the bounding box of e0.
  return withinBounds(e0, intersection);
}

export function coincident(e0, e1) {
  // Find the slope of the lines.
  const m0 = e0.slope(), m1 = e1.slope();
  // If the slopes are not the same, these edges cannot be coincident.
  if (Math.abs(m1 - m0) > EPSILON) {
    return false;
  }
  // Find the y-intercepts of the lines.
  const b0 = e0.yIntercept(), b1 = e1.yIntercept();
  // If the y-intercepts are not the same, these edges cannot be coincident.
  if (Math.abs(b1 - b0) > EPSILON) {
    return false;
  }
  // If these edges share the same vertices, then they are coincident.
  if (sharedVertices(e0, e1)) {
    return true;
  }
  // If any vertex falls within the bounds of an edge, the edges are coincident.
  if (withinBounds(e1, e0.left()) || withinBounds(e1, e0.right())) {
    return true;
  }
  if (withinBounds(e0, e1.left()) || withinBounds(e0, e1.right())) {
    return true;
  }
  // No vertices were in the bounds of an edge, the edges are not coincident.
  return false;
}

export function subsect(e0, e1) {
  // If edges are not coincident, there are no edge subsections.
  if (!coincident(e0, e1)) {
    return [];
  }
  // Sort the edge vertices left to right, bottom to top on the cartesian plane.
  const vertices = e0.vertices().concat(e1.vertices());
  const sorted = vertices.sort((va, vb) => {
    if (vertex.same(va, vb)) return 0;
    return (va.x < vb.x || va.y < vb.y) ? -1 : 1;
  });
  // Collect the all edges between the sorted vertices.
  return sorted.reduceRight((edges, v, i, arr) => {
    // If we're on the last vertex or the vertices are the same skip.
    if (i == 0 || vertex.same(v, arr[i - 1])) return edges;
    // Create and edge and add it to all our edges.
    edges.unshift(new Edge([[arr[i - 1].x, arr[i - 1].y], [v.x, v.y]]));
    return edges;
  }, []);
}

export function vertexIntersection(e, v) {
  // Find the line defined by e.
  const m = e.slope(), b = e.yIntercept();
  // Now, find the line perpendicular to e which passes through v.
  // Find the x-coord where this line intersects e.
  const ix = ( b - (v.y + v.x / m) ) * -m / (m * m + 1); 
  // Find the y-coord where this line intersects e.
  const iy = m * ix + b;
  // Create the vertex at (ix,iy).
  const iv = new vertex.Vertex(ix, iy);
  // Return iv if it's within the bounds of e. If not, there is no intersection.
  return (withinBounds(e, iv)) ? iv : null;
}

export function vertexDistance(e, v) {
  const iv = vertexIntersection(e, v);
  // If there is a perpendicular intersection of e and v, compute that distance.
  if (iv !== null) {
    return vertex.distance(iv, v);
  } else {
    // Otherwise, find the distance of v to the nearest vertex of e.
    return Math.min(
      vertex.distance(e.left(), v),
      vertex.distance(e.right(), v)
    );
  }
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
