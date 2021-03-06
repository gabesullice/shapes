import * as vertex from "./Vertex";
import { Edge } from "./Edge";

class Shape {

  constructor(points) {
    this._vertices = [];
    points.forEach((point, index) => {
      this._vertices[index] = new vertex.Vertex(point[0], point[1]);
    });
  }

  normalize() {
    return {
      type: "shape",
      data: {
        vertices: this.vertices().map(v => v.normalize())
      },
    };
  }

  vertices() {
    return this._vertices;
  }

  edges() {
    return this._vertices.reduce((edges, v, i, arr) => {
      // If this is the first vertex, create an edge to join it with the last.
      const next = (i == arr.length - 1) ? arr[0] : arr[i + 1];
      edges.push(new Edge([[v.x, v.y], [next.x, next.y]]));
      return edges;
    }, []);
  }

  rotate(angle) {
    return new Shape(this._vertices.map(v => {
      const rotated = vertex.rotate(v, angle);
      return [rotated.x, rotated.y];
    }));
  }

  translate(translation) {
    return new Shape(this._vertices.map(v => {
      const translated = vertex.translate(v, translation);
      return [translated.x, translated.y];
    }));
  }

  reflectX() {
    return this.reflect(0);
  }

  reflectY() {
    return this.reflect(Math.PI/2);
  }

  reflect(angle) {
    return new Shape(this.vertices().map(v => {
      const vr = vertex.reflect(v, angle);
      return [vr.x, vr.y];
    }));
  }

}

function same(s0, s1) {
  // Get the vertices of the shape as arrays.
  const v0s = s0.vertices(), v1s = s1.vertices();

  // Quick parity check.
  if (v0s.length != v1s.length) return false;

  let v0 = v0s.pop();
  while (v0) {
    // Does v0 exist in v1s?
    const index = v1s.findIndex(v1 => vertex.same(v0, v1));
    // If not, shapes are different.
    if (index === -1) return false;
    // If so, remove the vertex from the array so we don't use it twice.
    v1s.splice(index, 1);
    // Get the next vertex out of v0s.
    v0 = v0s.pop()
  }
  // If we made it this far, the shapes are the same.
  return true;
}

function denormalize(content) {
  if (content.type != 'shape') {
    throw Error('Unexpected type. Unable to denormalize.');
  }
  try {
    const vertices = content.data.vertices
      .map(v => vertex.denormalize(v))
      .map(v => [v.x, v.y]);
    return new Shape(vertices);
  } catch (e) {
    throw Error('Unexpected data. Unable to denormalize.');
  }
}

export default Shape;
export {Shape, same, denormalize};
