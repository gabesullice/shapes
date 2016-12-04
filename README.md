libshapes
====

[![Travis](https://img.shields.io/travis/gabesullice/libshapes.svg)](https://travis-ci.org/gabesullice/libshapes)

`libshapes` is a package exporting classes and functions for representing, manipulating, and inspecting 2d geometric shapes.

# Contents

- [Overview](#overview)
- [Documentation](#documentation)
  - [Vertex](#vertex)
  - [Edge](#edge)
  - [Shape](#shape)
  - [Figure](#figure)

# Overview

`libshapes` is composed of small modules which can be combined to represent complex geometric shapes and collections of shapes. At the most basic level is the `Vertex`, which provides a class for an (x,y) coordinate. This includes methods and functions for comparing, rotating, and translating vertices. Above this, is the `Edge` module. This module provides a class which contains two `Vertex`s, the line between them being the "edge". This module also includes comparison, mutation, and a few other utilities for working with edges. Above this, the `Shape`. This is a class composed of many edges. These too can be compared and mutated. A `Figure` is a `Shape` paired with a position and angle of rotation. This allows a shape to be represented and moved about a cartesian plane. `Figure`s can be compared for overlap, colocation, and shape. `Figure`s can all be mutated.

# Documentation

## `Vertex`
Building block for all shapes. A `Vertex` is defined by an `x` and a `y` coordinates.

`class Vertex([x, y])`

Constructs a new `Vertex`.

`function distance(Vertex, Vertex)`

Computes the absolute distance between two `Vertex`s.

`function same(Vertex, Vertex)`

Whether two `Vertex`s share the same coordinates, accurate to within `0.0000001`.

`function rotate(Vertex, angle)`

Returns a new `Vertex` rotated about the origin (0,0). `angle` is given in radians.

`function translate(Vertex, [offsetX, offsetY])`

Returns a new `Vertex` translated by `Vertex.x + offsetX` and `Vertex.y + offsetY`.


## `Edge`
Composed of two vertices, an `Edge` is the line between to `Vertex`s.

`class Edge([[x0, y0], [x1, y1]])`

Constructs a new `Edge`. _Note_: takes an array of length 2, containing two arrays of two real numbers. Does _not_ take two `Vertex`s.

`Edge.slope()`

Returns the slope of the `Edge`.

`Edge.vertices()`

Returns the `Vertex`s of the `Edge`.

`Edge.yIntercept()`

Returns the y-intercept of the line defined by the `Edge`. _Note_: The `Edge` does _not_ need to intersect the y-axis to have a y-intercept.

`Edge.left()`

Returns the `Vertex` of the `Edge` with the lesser x coordinate.

`Edge.right()`

Returns the `Vertex` of the `Edge` with the greater x coordinate.

`Edge.top()`

Returns the `Vertex` of the `Edge` with the greater y coordinate.

`Edge.bottom()`

Returns the `Vertex` of the `Edge` with the lesser y coordinate.

`function same(Edge, Edge)`

Whether the given `Edge`s share the same `Vertex`s.

`function intersect(Edge, Edge)`

Whether two `Edge`s intersect.

`function coincident(Edge, Edge)`

Whether two `Edge`s are _coincident_. That is, whether they are parallel and overlapped.

`function subsect(Edge, Edge)`

Returns a new array of `Edge`s. Derived from the `Vertex`s of two coincident `Edge`s. If the given `Edge`s are _not_ coincident, an empty array is returned.

`function vertexIntersection(Edge, Vertex)`

Finds a `Vertex`, `iv`, along `Edge` where a line perpendicular to `Edge` also passes through `Vertex`. If one does not exist, returns `null`.

`function vertexDistance(Edge, Vertex)`

Find the shortest distance between any point on `Edge` to `Vertex`.

## `Shape`
A geometric object composed of three or more `Vertex`s.

`class Shape([[x0, y0], [x1, y1], [x2, x2][, ...[xN, yN]]])`

Constructs a new `Shape`. _Note_: takes an array, `V`, of [x, y] coordinates where `V.length >= 2`.

`Shape.vertices()`

Returns the `Vertex`s of the `Shape`.

`Shape.edges()`

Returns the `Edge`s defined by the `Vertex`s of the `Shape`.

`Shape.rotate(angle)`

Returns a new `Shape` rotated about the origin (0,0). `angle` is given in radians.

`Shape.translate([offsetX, offsetY])`

Returns a new `Shape` translated by the given offsets.

## `Figure`
A representation of a `Shape` combined with positional coordinates and a rotation angle.

`class Figure({shape: Shape[, position: [offsetX, offsetY][, rotation: angle]})`

Constructs a new `Figure`. The only required key is `shape`. Defaults: `{position: [0,0], rotation: 0}`. `rotation` is given in radians.
