/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRef, useEffect } from 'react';

function CartoonFigureCanvas(props) {
  const canvasRef = useRef(null);

  useEffect(() => {
    let TAU = Math.PI * 2;

    function extend(a, b) {
      for (let prop in b) {
        a[prop] = b[prop];
      }
      return a;
    }

    function lerp(a, b, t) {
      return (b - a) * t + a;
    }

    function modulo(num, div) {
      return ((num % div) + div) % div;
    }

    // -------------------------- Vector3 -------------------------- //

    function Vector3(position) {
      this.set(position);
    }

    Vector3.prototype.set = function (pos) {
      pos = Vector3.sanitize(pos);
      this.x = pos.x;
      this.y = pos.y;
      this.z = pos.z;
      return this;
    };

    Vector3.prototype.rotate = function (rotation) {
      if (!rotation) {
        return;
      }
      this.rotateZ(rotation.z);
      this.rotateY(rotation.y);
      this.rotateX(rotation.x);
      return this;
    };

    Vector3.prototype.rotateZ = function (angle) {
      rotateProperty(this, angle, 'x', 'y');
    };

    Vector3.prototype.rotateX = function (angle) {
      rotateProperty(this, angle, 'y', 'z');
    };

    Vector3.prototype.rotateY = function (angle) {
      rotateProperty(this, angle, 'x', 'z');
    };

    function rotateProperty(vec, angle, propA, propB) {
      if (angle % TAU === 0) {
        return;
      }
      let cos = Math.cos(angle);
      let sin = Math.sin(angle);
      let a = vec[propA];
      let b = vec[propB];
      vec[propA] = a * cos - b * sin;
      vec[propB] = b * cos + a * sin;
    }

    Vector3.prototype.add = function (vec) {
      if (!vec) {
        return;
      }
      vec = Vector3.sanitize(vec);
      this.x += vec.x;
      this.y += vec.y;
      this.z += vec.z;
      return this;
    };

    Vector3.prototype.multiply = function (vec) {
      if (!vec) {
        return;
      }
      vec = Vector3.sanitize(vec);
      this.x *= vec.x;
      this.y *= vec.y;
      this.z *= vec.z;
      return this;
    };

    Vector3.prototype.lerp = function (vec, t) {
      this.x = lerp(this.x, vec.x, t);
      this.y = lerp(this.y, vec.y, t);
      this.z = lerp(this.z, vec.z, t);
      return this;
    };

    // ----- utils ----- //

    // add missing properties
    Vector3.sanitize = function (vec) {
      vec = vec || {};
      vec.x = vec.x || 0;
      vec.y = vec.y || 0;
      vec.z = vec.z || 0;
      return vec;
    };

    // -------------------------- PathAction -------------------------- //

    function PathAction(method, points, previousPoint) {
      this.method = method;
      this.points = points.map(mapVectorPoint);
      this.renderPoints = points.map(mapVectorPoint);
      this.previousPoint = previousPoint;
      this.endRenderPoint = this.renderPoints[this.renderPoints.length - 1];
      // arc actions come with previous point & corner point
      // but require bezier control points
      if (method == 'arc') {
        this.controlPoints = [new Vector3(), new Vector3()];
      }
    }

    function mapVectorPoint(point) {
      return new Vector3(point);
    }

    PathAction.prototype.reset = function () {
      // reset renderPoints back to orignal points position
      let points = this.points;
      this.renderPoints.forEach(function (renderPoint, i) {
        let point = points[i];
        renderPoint.set(point);
      });
    };

    PathAction.prototype.transform = function (translation, rotation, scale) {
      this.renderPoints.forEach(function (renderPoint) {
        renderPoint.multiply(scale);
        renderPoint.rotate(rotation);
        renderPoint.add(translation);
      });
    };

    PathAction.prototype.render = function (ctx) {
      this[this.method](ctx);
    };

    PathAction.prototype.move = function (ctx) {
      let point = this.renderPoints[0];
      ctx.moveTo(point.x, point.y);
    };

    PathAction.prototype.line = function (ctx) {
      let point = this.renderPoints[0];
      ctx.lineTo(point.x, point.y);
    };

    PathAction.prototype.bezier = function (ctx) {
      let cp0 = this.renderPoints[0];
      let cp1 = this.renderPoints[1];
      let end = this.renderPoints[2];
      ctx.bezierCurveTo(cp0.x, cp0.y, cp1.x, cp1.y, end.x, end.y);
    };

    PathAction.prototype.arc = function (ctx) {
      let prev = this.previousPoint;
      let corner = this.renderPoints[0];
      let end = this.renderPoints[1];
      let cp0 = this.controlPoints[0];
      let cp1 = this.controlPoints[1];
      cp0.set(prev).lerp(corner, 9 / 16);
      cp1.set(end).lerp(corner, 9 / 16);
      ctx.bezierCurveTo(cp0.x, cp0.y, cp1.x, cp1.y, end.x, end.y);
    };

    // -------------------------- Shape -------------------------- //

    function Shape(options) {
      this.create(options);
    }

    Shape.prototype.create = function (options) {
      // default
      extend(this, Shape.defaults);
      // set options
      setOptions(this, options);

      this.updatePathActions();

      // transform
      this.translate = new Vector3(options.translate);
      this.rotate = new Vector3(options.rotate);
      let scale = extend({ x: 1, y: 1, z: 1 }, options.scale);
      this.scale = new Vector3(scale);
      // children
      this.children = [];
      if (this.addTo) {
        this.addTo.addChild(this);
      }
    };

    Shape.defaults = {
      stroke: true,
      fill: false,
      color: 'black',
      lineWidth: 1,
      closed: true,
      rendering: true,
      path: [{}]
    };

    let optionKeys = Object.keys(Shape.defaults).concat(['rotate', 'translate', 'scale', 'addTo', 'width', 'height']);

    function setOptions(shape, options) {
      for (let key in options) {
        if (optionKeys.includes(key)) {
          shape[key] = options[key];
        }
      }
    }

    let actionNames = ['move', 'line', 'bezier', 'arc'];

    // parse path into PathActions
    Shape.prototype.updatePathActions = function () {
      let previousPoint;
      this.pathActions = this.path.map(function (pathPart, i) {
        // pathPart can be just vector coordinates -> { x, y, z }
        // or path instruction -> { arc: [ {x0,y0,z0}, {x1,y1,z1} ] }
        let keys = Object.keys(pathPart);
        let method = keys[0];
        let points = pathPart[method];
        let isInstruction = keys.length === 1 && actionNames.includes(method) && Array.isArray(points);

        if (!isInstruction) {
          method = 'line';
          points = [pathPart];
        }

        // first action is always move
        method = i === 0 ? 'move' : method;
        // arcs require previous last point
        let pathAction = new PathAction(method, points, previousPoint);
        // update previousLastPoint
        previousPoint = pathAction.endRenderPoint;
        return pathAction;
      });
    };

    Shape.prototype.addChild = function (shape) {
      this.children.push(shape);
    };

    // ----- update ----- //

    Shape.prototype.update = function () {
      // update self
      this.reset();
      // update children
      this.children.forEach(function (child) {
        child.update();
      });
      this.transform(this.translate, this.rotate, this.scale);
    };

    Shape.prototype.reset = function () {
      // reset pathAction render points
      this.pathActions.forEach(function (pathAction) {
        pathAction.reset();
      });
    };

    Shape.prototype.transform = function (translation, rotation, scale) {
      // transform points
      this.pathActions.forEach(function (pathAction) {
        pathAction.transform(translation, rotation, scale);
      });
      // transform children
      this.children.forEach(function (child) {
        child.transform(translation, rotation, scale);
      });
    };

    Shape.prototype.updateSortValue = function () {
      let sortValueTotal = 0;
      this.pathActions.forEach(function (pathAction) {
        sortValueTotal += pathAction.endRenderPoint.z;
      });
      // average sort value of all points
      // def not geometrically correct, but works for me
      this.sortValue = sortValueTotal / this.pathActions.length;
    };

    // ----- render ----- //

    Shape.prototype.render = function (ctx) {
      let length = this.pathActions.length;
      if (!this.rendering || !length) {
        return;
      }
      let isDot = length == 1;
      if (isDot) {
        this.renderDot(ctx);
      } else {
        this.renderPath(ctx);
      }
    };

    // Safari does not render lines with no size, have to render circle instead
    Shape.prototype.renderDot = function (ctx) {
      ctx.fillStyle = this.color;
      let point = this.pathActions[0].endRenderPoint;
      ctx.beginPath();
      let radius = this.lineWidth / 2;
      ctx.arc(point.x, point.y, radius, 0, TAU);
      ctx.fill();
    };

    Shape.prototype.renderPath = function (ctx) {
      // set render properties
      ctx.fillStyle = this.color;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.lineWidth;

      // render points
      ctx.beginPath();
      this.pathActions.forEach(function (pathAction) {
        pathAction.render(ctx);
      });
      let isTwoPoints = this.pathActions.length == 2 && this.pathActions[1].method == 'line';
      if (!isTwoPoints && this.closed) {
        ctx.closePath();
      }
      if (this.stroke) {
        ctx.stroke();
      }
      if (this.fill) {
        ctx.fill();
      }
    };

    // return Array of self & all child shapes
    Shape.prototype.getShapes = function () {
      let shapes = [this];
      this.children.forEach(function (child) {
        let childShapes = child.getShapes();
        shapes = shapes.concat(childShapes);
      });
      return shapes;
    };

    Shape.prototype.copy = function (options) {
      // copy options
      let shapeOptions = {};
      optionKeys.forEach(function (key) {
        shapeOptions[key] = this[key];
      }, this);
      // add set options
      setOptions(shapeOptions, options);
      let ShapeClass = this.constructor;
      return new ShapeClass(shapeOptions);
    };

    // -------------------------- Ellipse -------------------------- //

    function Ellipse(options) {
      options = this.setPath(options);
      // always keep open
      // fixes overlap bug when lineWidth is greater than radius
      options.closed = false;
      this.create(options);
    }

    Ellipse.prototype = Object.create(Shape.prototype);
    Ellipse.prototype.constructor = Ellipse;

    Ellipse.prototype.setPath = function (options) {
      let w = options.width / 2;
      let h = options.height / 2;
      options.path = [
        { x: 0, y: -h },
        {
          arc: [
            // top right
            { x: w, y: -h },
            { x: w, y: 0 }
          ]
        },
        {
          arc: [
            // bottom right
            { x: w, y: h },
            { x: 0, y: h }
          ]
        },
        {
          arc: [
            // bottom left
            { x: -w, y: h },
            { x: -w, y: 0 }
          ]
        },
        {
          arc: [
            // bottom left
            { x: -w, y: -h },
            { x: 0, y: -h }
          ]
        }
      ];
      return options;
    };

    // -------------------------- Group -------------------------- //

    function Group(options) {
      this.create(options);
    }

    Group.prototype.create = function (options) {
      // set options
      setGroupOptions(this, options);

      // transform
      this.translate = Vector3.sanitize(this.translate);
      this.rotate = Vector3.sanitize(this.rotate);
      // children
      this.children = [];
      if (this.addTo) {
        this.addTo.addChild(this);
      }
    };

    let groupOptionKeys = ['rotate', 'translate', 'addTo'];

    function setGroupOptions(shape, options) {
      for (let key in options) {
        if (groupOptionKeys.includes(key)) {
          shape[key] = options[key];
        }
      }
    }

    Group.prototype.addChild = function (shape) {
      this.children.push(shape);
    };

    // ----- update ----- //

    Group.prototype.update = function () {
      // update self
      this.reset();
      // update children
      this.children.forEach(function (child) {
        child.update();
      });
      this.transform(this.translate, this.rotate, this.scale);
    };

    Group.prototype.reset = function () {};

    Group.prototype.transform = function (translation, rotation, scale) {
      // transform children
      this.children.forEach(function (child) {
        child.transform(translation, rotation, scale);
      });
    };

    Group.prototype.updateSortValue = function () {
      let sortValueTotal = 0;
      this.children.forEach(function (child) {
        child.updateSortValue();
        sortValueTotal += child.sortValue;
      });
      // TODO sort children?
      // average sort value of all points
      // def not geometrically correct, but works for me
      this.sortValue = sortValueTotal / this.children.length;
    };

    // ----- render ----- //

    Group.prototype.render = function (ctx) {
      this.children.forEach(function (child) {
        child.render(ctx);
      });
    };

    // do not include children, group handles rendering & sorting internally
    Group.prototype.getShapes = function () {
      return [this];
    };

    // -------------------------- Dragger -------------------------- //

    // quick & dirty drag event stuff
    // messes up if multiple pointers/touches

    // event support, default to mouse events
    let downEvent = 'mousedown';
    let moveEvent = 'mousemove';
    let upEvent = 'mouseup';
    if (window.PointerEvent) {
      // PointerEvent, Chrome
      downEvent = 'pointerdown';
      moveEvent = 'pointermove';
      upEvent = 'pointerup';
    } else if ('ontouchstart' in window) {
      // Touch Events, iOS Safari
      downEvent = 'touchstart';
      moveEvent = 'touchmove';
      upEvent = 'touchend';
    }

    function noop() {}

    function Dragger(options) {
      this.startElement = options.startElement;
      this.onPointerDown = options.onPointerDown || noop;
      this.onPointerMove = options.onPointerMove || noop;
      this.onPointerUp = options.onPointerUp || noop;

      this.startElement.addEventListener(downEvent, this);
    }

    Dragger.prototype.handleEvent = function (event) {
      let method = this['on' + event.type];
      if (method) {
        method.call(this, event);
      }
    };

    Dragger.prototype.onmousedown = Dragger.prototype.onpointerdown = function (event) {
      this.pointerDown(event, event);
    };

    Dragger.prototype.ontouchstart = function (event) {
      this.pointerDown(event, event.changedTouches[0]);
    };

    Dragger.prototype.pointerDown = function (event, pointer) {
      event.preventDefault();
      this.dragStartX = pointer.pageX;
      this.dragStartY = pointer.pageY;
      window.addEventListener(moveEvent, this);
      window.addEventListener(upEvent, this);
      this.onPointerDown(pointer);
    };

    Dragger.prototype.ontouchmove = function (event) {
      // HACK, moved touch may not be first
      this.pointerMove(event, event.changedTouches[0]);
    };

    Dragger.prototype.onmousemove = Dragger.prototype.onpointermove = function (event) {
      this.pointerMove(event, event);
    };

    Dragger.prototype.pointerMove = function (event, pointer) {
      event.preventDefault();
      let moveX = pointer.pageX - this.dragStartX;
      let moveY = pointer.pageY - this.dragStartY;
      this.onPointerMove(pointer, moveX, moveY);
    };

    Dragger.prototype.onmouseup =
      Dragger.prototype.onpointerup =
      Dragger.prototype.ontouchend =
      Dragger.prototype.pointerUp =
        function (event) {
          window.removeEventListener(moveEvent, this);
          window.removeEventListener(upEvent, this);
          this.onPointerUp(event);
        };

    function BokehShape(options) {
      this.create(options);
      this.bokehSize = options.bokehSize || 5;
      this.bokehLimit = options.bokehLimit || 64;
    }

    BokehShape.prototype = Object.create(Shape.prototype);

    BokehShape.prototype.updateBokeh = function () {
      // bokeh 0 -> 1
      this.bokeh = Math.abs(this.sortValue) / this.bokehLimit;
      this.bokeh = Math.max(0, Math.min(1, this.bokeh));
      return this.bokeh;
    };

    BokehShape.prototype.getBokehLineWidth = function () {
      return this.lineWidth + this.bokehSize * this.bokeh * this.bokeh;
    };

    BokehShape.prototype.getBokehAlpha = function () {
      let revBokeh = 1 - this.bokeh;
      revBokeh *= revBokeh;
      return revBokeh * 0.8 + 0.2;
    };

    // Safari does not render lines with no size, have to render circle instead
    BokehShape.prototype.renderDot = function (ctx) {
      this.updateBokeh();
      ctx.globalAlpha = this.getBokehAlpha();
      ctx.fillStyle = this.color;
      let point = this.pathActions[0].endRenderPoint;
      ctx.beginPath();
      let radius = this.getBokehLineWidth() / 2;
      ctx.arc(point.x, point.y, radius, 0, TAU);
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    BokehShape.prototype.renderPath = function (ctx) {
      this.updateBokeh();
      ctx.globalAlpha = this.getBokehAlpha();
      // set render properties
      ctx.fillStyle = this.color;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.getBokehLineWidth();

      // render points
      ctx.beginPath();
      this.pathActions.forEach(function (pathAction) {
        pathAction.render(ctx);
      });
      let isTwoPoints = this.pathActions.length == 2 && this.pathActions[1].method == 'line';
      if (!isTwoPoints && this.closed) {
        ctx.closePath();
      }
      if (this.stroke) {
        ctx.stroke();
      }
      if (this.fill) {
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    /* jshint unused: false */

    function makeMadeline(camera, isGood, colors, rotation) {
      let rotor = new Shape({
        rendering: false,
        addTo: camera,
        rotate: rotation
      });

      let body = new Shape({
        rendering: false,
        addTo: rotor,
        rotate: { x: TAU / 8 },
        translate: { z: 48 }
      });

      let head = new Shape({
        rendering: false,
        addTo: body,
        translate: { y: -11, z: 2 },
        rotate: { x: -TAU / 8 }
      });

      // face
      let face = new Ellipse({
        width: 6,
        height: 6,
        addTo: head,
        translate: { z: -4 },
        lineWidth: 8,
        color: colors.skin
      });

      let eyeGroup = new Group({
        addTo: face,
        translate: { z: -face.lineWidth / 2 + 0.5 }
      });

      // eyes
      [-1, 1].forEach(function (xSide) {
        // cheek blush
        if (isGood) {
          new Ellipse({
            width: 2,
            height: 1.3,
            addTo: eyeGroup,
            translate: { x: 4.5 * xSide, y: 3, z: 1 },
            rotate: { y: (TAU / 16) * xSide },
            lineWidth: 1,
            color: '#FA8',
            fill: true
          });
        }

        let eyeX = 3.5 * xSide;

        // eye
        let eyeWhite = new Ellipse({
          width: 0.75,
          height: 1.5,
          addTo: eyeGroup,
          color: colors.eye,
          translate: { x: eyeX },
          lineWidth: 2,
          fill: true
        });

        // eye brow
        new Shape({
          path: [
            { x: -1, y: 0 },
            {
              arc: [
                { x: -1, y: -1 },
                { x: 0, y: -1 }
              ]
            },
            {
              arc: [
                { x: 1, y: -1 },
                { x: 1, y: 0 }
              ]
            }
          ],
          addTo: eyeGroup,
          translate: { x: eyeX, y: -3 },
          scale: { x: 1.5, y: 0.6 },
          rotate: { z: 0.15 * xSide * (isGood ? 1 : -1) },
          color: colors.hair,
          lineWidth: 1,
          fill: true
        });
      });

      // hair ball
      new Shape({
        path: [{ x: -1 }, { x: 1 }, { z: 4 }],
        addTo: head,
        translate: { y: -4, z: 1 },
        lineWidth: 18,
        color: colors.hair
      });

      let bang = new Shape({
        path: [
          {},
          {
            arc: [
              { z: -4, y: 4 },
              { z: 0, y: 8 }
            ]
          }
        ],
        addTo: head,
        translate: { x: 2, y: -7.5, z: -6 },
        rotate: { x: -0.5, z: -0.5 },
        lineWidth: 4,
        color: colors.hair,
        closed: false
      });
      bang.copy({
        translate: { x: 5, y: -6, z: -5 },
        rotate: { x: 0.3, z: -0.5 }
      });
      bang.copy({
        translate: { x: 5, y: -6, z: -3 },
        rotate: { y: 0.7, z: -1 }
      });

      // left side
      bang.copy({
        translate: { x: -2, y: -7.5, z: -6 },
        rotate: { x: 0, z: (TAU / 16) * 6 }
      });
      bang.copy({
        translate: { x: -5, y: -6, z: -5 },
        rotate: { x: 0, z: TAU / 4 }
      });
      bang.copy({
        translate: { x: -5, y: -6, z: -3 },
        rotate: { y: -0.7, z: 1 }
      });

      // hair cover
      new Shape({
        path: [{ x: -3 }, { x: 3 }],
        addTo: head,
        lineWidth: 7,
        translate: { y: -8, z: -5 },
        color: colors.hair
      });

      // trail locks

      let trailLock = new Shape({
        path: [
          { y: -4, z: 0 },
          {
            bezier: [
              { y: -10, z: 14 },
              { y: 0, z: 16 },
              { y: 0, z: 26 }
            ]
          }
        ],
        addTo: head,
        translate: { z: 4, y: 0 },
        lineWidth: 10,
        color: colors.hair,
        closed: false
      });

      trailLock.copy({
        translate: { x: -3, z: 4 },
        rotate: { z: -TAU / 8 },
        lineWidth: 8
      });
      trailLock.copy({
        translate: { x: 3, z: 4 },
        rotate: { z: TAU / 8 },
        lineWidth: 8
      });
      trailLock.copy({
        translate: { y: 2 },
        // rotate: { z: TAU/2 },
        scale: { y: 0.5 },
        lineWidth: 8
      });

      // ----- torso ----- //

      // 2nd rib
      let torsoRib = new Ellipse({
        width: 12,
        height: 10,
        addTo: body,
        rotate: { x: TAU / 4 },
        translate: { y: -1 },
        lineWidth: 6,
        color: colors.parkaLight,
        fill: true
      });
      // neck rib
      torsoRib.copy({
        width: 6,
        height: 6,
        translate: { y: -5 }
      });
      // 3rd rib
      torsoRib.copy({
        translate: { y: 3 }
      });
      // 4th rib
      torsoRib.copy({
        translate: { y: 7 },
        color: colors.parkaDark
      });
      // waist
      new Ellipse({
        width: 10,
        height: 8,
        addTo: body,
        rotate: { x: TAU / 4 },
        translate: { y: 11 },
        lineWidth: 4,
        color: colors.tight,
        fill: true
      });

      // arms
      [-1, 1].forEach(function (xSide) {
        // shoulder ball
        new Shape({
          addTo: body,
          lineWidth: 6,
          translate: { x: 6 * xSide, y: -5, z: 1 },
          color: colors.parkaLight
        });

        let shoulderJoint = new Shape({
          rendering: false,
          addTo: body,
          translate: { x: 9 * xSide, y: -3, z: 2 }
        });

        // top shoulder rib
        let armRib = new Ellipse({
          width: 2,
          height: 2,
          rotate: { x: TAU / 4 },
          addTo: shoulderJoint,
          translate: { x: 0 * xSide },
          lineWidth: 6,
          color: colors.parkaLight,
          fill: true
        });
        armRib.copy({
          translate: { y: 4 }
        });

        let elbowJoint = new Shape({
          rendering: false,
          addTo: shoulderJoint,
          translate: { y: 8 }
        });

        armRib.copy({
          addTo: elbowJoint,
          translate: { x: 0, y: 0 }
        });
        armRib.copy({
          addTo: elbowJoint,
          translate: { y: 4 },
          color: colors.parkaDark
        });

        // hand
        new Shape({
          addTo: elbowJoint,
          translate: { y: 9, z: -1 },
          lineWidth: 8,
          color: colors.skin
        });

        if (xSide == 1) {
          // extend left hand
          shoulderJoint.rotate = Vector3.sanitize({ x: (-TAU / 8) * 3, z: -TAU / 32 });
        } else {
          // back right hand
          shoulderJoint.rotate = Vector3.sanitize({ z: (TAU / 16) * 2, x: (TAU / 16) * 2 });
          elbowJoint.rotate = Vector3.sanitize({ z: TAU / 8 });
        }

        // ----- legs ----- //
        let knee = { y: 7 };
        let thigh = new Shape({
          path: [{ y: 0 }, knee],
          addTo: body,
          translate: { x: 4 * xSide, y: 13 },
          lineWidth: 8,
          color: colors.tight
        });

        let shin = new Shape({
          path: [{ y: 0 }, { y: 8 }],
          addTo: thigh,
          lineWidth: 6,
          translate: knee,
          color: colors.tight
        });

        if (xSide == -1) {
          // bend right leg
          thigh.rotate = Vector3.sanitize({ x: (-TAU / 16) * 3, z: TAU / 16 });
          shin.rotate = Vector3.sanitize({ x: (TAU / 16) * 5 });
        }
      });

      // butt
      new Shape({
        path: [{ x: -3 }, { x: 3 }],
        rendering: false,
        addTo: body,
        translate: { y: 11, z: 2 },
        lineWidth: 8,
        color: colors.tight
      });
    }

    function makeBird(options) {
      let spin = options.spin || 0;

      let arrow = new Shape({
        rendering: false,
        addTo: options.addTo,
        scale: { x: 2 / 3, y: 2 / 3, z: 2 / 3 },
        rotate: { z: spin }
      });

      let bird = new Group({
        addTo: arrow,
        translate: { x: 87 },
        rotate: { x: spin }
      });

      // bird body
      new Shape({
        path: [
          { x: -3, y: 0 },
          {
            arc: [
              { x: -2, y: 1.5 },
              { x: 0, y: 1.5 }
            ]
          },
          {
            arc: [
              { x: 2, y: 1.5 },
              { x: 2, y: 0 }
            ]
          }
        ],
        addTo: bird,
        translate: { x: 0.5 },
        lineWidth: 3,
        color: options.color,
        fill: true
      });

      // bird head
      new Shape({
        translate: { x: 4, y: -1 },
        addTo: bird,
        lineWidth: 4,
        color: options.color
      });

      // beak
      new Shape({
        path: [
          { x: 0, y: -1 },
          { x: 3, y: 0 },
          { x: 0, y: 1 }
        ],
        addTo: bird,
        translate: { x: 5, y: -1 },
        lineWidth: 1,
        color: options.color,
        fill: true
      });

      // tail feather
      new Shape({
        path: [
          { x: -3, z: -2 },
          { x: 0, z: 0 },
          { x: -3, z: 2 }
        ],
        addTo: bird,
        translate: { x: -4, y: 0 },
        lineWidth: 2,
        color: options.color,
        fill: true
      });

      let wing = new Shape({
        path: [
          { x: 3, y: 0 },
          { x: -1, y: -9 },
          {
            arc: [
              { x: -5, y: -4 },
              { x: -3, y: 0 }
            ]
          }
        ],
        addTo: bird,
        translate: { z: -1.5 },
        rotate: { x: TAU / 8 },
        lineWidth: 1,
        color: options.color,
        fill: true
      });

      wing.copy({
        translate: { z: 1.5 },
        scale: { z: -1 },
        rotate: { x: -TAU / 8 }
      });
    }

    /* globals makeMadeline, BokehShape, makeBird */

    // -------------------------- demo -------------------------- //

    let canvas = canvasRef.current;
    let ctx = canvas.getContext('2d');
    let w = props.w || 160;
    let h = props.h || 160;
    let minWindowSize = Math.min(window.innerWidth, window.innerHeight);
    let zoom = Math.min(2, Math.floor(minWindowSize / w));
    let pixelRatio = window.devicePixelRatio || 1;
    zoom *= pixelRatio;
    let canvasWidth = (canvas.width = w * zoom);
    let canvasHeight = (canvas.height = h * zoom);
    // set canvas screen size
    if (pixelRatio > 1) {
      canvas.style.width = canvasWidth / pixelRatio + 'px';
      canvas.style.height = canvasHeight / pixelRatio + 'px';
    }

    let isRotating = true;

    let madColor = {
      skin: '#FD9',
      hair: '#D53',
      parkaLight: '#67F',
      parkaDark: '#35D',
      tight: '#742',
      eye: '#333'
    };
    let badColor = {
      skin: '#EBC',
      hair: '#D4B',
      parkaLight: '#85A',
      parkaDark: '#527',
      tight: '#412',
      eye: '#D02'
    };

    let glow = 'hsla(60, 100%, 80%, 0.3)';
    let featherGold = '#FE5';

    let camera = new Shape({
      rendering: false,
      rotate: { y: TAU / 4 }
    });

    // -- illustration shapes --- //

    makeMadeline(camera, true, madColor);
    makeMadeline(camera, false, badColor, { y: TAU / 2 });

    // ----- feather ----- //

    let feather = new Shape({
      rendering: false,
      addTo: camera,
      rotate: { y: -TAU / 4 }
    });

    (function () {
      let featherPartCount = 8;
      let radius = 12;
      let angleX = TAU / featherPartCount / 2;
      let sector = (TAU * radius) / 2 / featherPartCount;

      for (let i = 0; i < featherPartCount; i++) {
        let curve = Math.cos(((i / featherPartCount) * TAU * 3) / 4 + (TAU * 1) / 4);
        let x = 4 - curve * 2;
        let y0 = sector / 2;
        // var y2 = -sector/2;
        let isLast = i == featherPartCount - 1;
        let y3 = isLast ? sector * -1 : -y0;
        let z1 = -radius + 2 + curve * -1.5;
        let z2 = isLast ? -radius : -radius;
        let barb = new Shape({
          path: [
            { x: 0, y: y0, z: -radius },
            { x: x, y: -sector / 2, z: z1 },
            { x: x, y: (-sector * 3) / 4, z: z1 },
            { x: 0, y: y3, z: z2 }
          ],
          addTo: feather,
          rotate: { x: angleX * -i + TAU / 8 },
          lineWidth: 1,
          color: featherGold,
          fill: true
        });
        barb.copy({
          scale: { x: -1 }
        });
      }

      // rachis
      let rachis = new Shape({
        path: [
          { y: -radius },
          {
            arc: [
              { y: -radius, z: -radius },
              { y: 0, z: -radius }
            ]
          },
          {
            arc: [
              { y: radius, z: -radius },
              { y: radius, z: 0 }
            ]
          }
        ],
        addTo: feather,
        lineWidth: 2,
        color: featherGold,
        closed: false
      });
      rachis.copy({
        lineWidth: 8,
        color: glow,
        rotate: { x: -0.5 }
      });
    })();

    // ----- rods ----- //

    (function () {
      let rodCount = 14;
      for (let i = 0; i < rodCount; i++) {
        let zRotor = new Shape({
          rendering: false,
          addTo: camera,
          rotate: { z: (TAU / rodCount) * i }
        });

        let y0 = 32;
        let y1 = y0 + 2 + Math.random() * 24;
        new BokehShape({
          path: [{ y: y0 }, { y: y1 }],
          addTo: zRotor,
          rotate: { x: ((Math.random() * 2 - 1) * TAU) / 8 },
          color: madColor.skin,
          lineWidth: 1,
          bokehSize: 6,
          bokehLimit: 70
        });
      }
    })();

    // dots

    (function () {
      let dotCount = 64;

      for (let i = 0; i < dotCount; i++) {
        let yRotor = new Shape({
          rendering: false,
          addTo: camera,
          rotate: { y: (TAU / dotCount) * i }
        });

        new BokehShape({
          path: [{ z: 40 * (1 - Math.random() * Math.random()) + 32 }],
          addTo: yRotor,
          rotate: { x: ((Math.random() * 2 - 1) * TAU * 3) / 16 },
          color: badColor.skin,
          lineWidth: 1 + Math.random(),
          bokehSize: 6,
          bokehLimit: 74
        });
      }
    })();

    // ----- birds ----- //

    let birdRotor = new Shape({
      rendering: false,
      addTo: camera,
      rotate: { y: (TAU * 1) / 8 }
    });

    makeBird({
      addTo: birdRotor,
      color: madColor.parkaLight,
      spin: TAU / 2
    });

    makeBird({
      addTo: birdRotor,
      color: featherGold,
      spin: (-TAU * 3) / 8
    });

    makeBird({
      addTo: birdRotor,
      color: 'white',
      spin: -TAU / 4
    });

    makeBird({
      addTo: birdRotor,
      color: madColor.hair,
      spin: -TAU / 8
    });

    makeBird({
      addTo: birdRotor,
      color: madColor.parkaDark,
      spin: TAU / 8
    });

    // -----  ----- //

    let shapes = camera.getShapes();

    // -- animate --- //

    let rotateSpeed = -TAU / 60;
    let xClock = 0;
    let then = new Date() - 1 / 60;

    function animate() {
      update();
      render();
      requestAnimationFrame(animate);
    }

    animate();

    // -- update -- //

    function update() {
      let now = new Date();
      let delta = now - then;
      // auto rotate
      if (isRotating) {
        let theta = (rotateSpeed / 60) * delta;
        camera.rotate.y += theta;
        xClock += theta / 4;
        camera.rotate.x = (Math.sin(xClock) * TAU) / 12;
      }

      // rotate
      camera.update();
      shapes.forEach(function (shape) {
        shape.updateSortValue();
      });
      // perspective sort
      shapes.sort(function (a, b) {
        return b.sortValue - a.sortValue;
      });

      then = now;
    }

    // -- render -- //

    function render() {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.save();
      ctx.scale(zoom, zoom);
      ctx.translate(w / 2, h / 2);

      shapes.forEach(function (shape) {
        shape.render(ctx);
      });

      ctx.restore();
    }

    // ----- inputs ----- //

    // click drag to rotate
    let dragStartAngleX, dragStartAngleY;

    new Dragger({
      startElement: canvas,
      onPointerDown: function () {
        isRotating = false;
        dragStartAngleX = camera.rotate.x;
        dragStartAngleY = camera.rotate.y;
      },
      onPointerMove: function (pointer, moveX, moveY) {
        let angleXMove = (moveY / canvasWidth) * TAU;
        let angleYMove = (moveX / canvasWidth) * TAU;
        camera.rotate.x = dragStartAngleX + angleXMove;
        camera.rotate.y = dragStartAngleY + angleYMove;
      }
    });
  }, []);
  return <canvas ref={canvasRef}></canvas>;
}

export default CartoonFigureCanvas;
