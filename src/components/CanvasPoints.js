import React from 'react';
import { TweenLite, Circ } from 'gsap/TweenMax';

export default class CanvasPoints extends React.Component {
  canvas = React.createRef();

  componentDidMount() {
    this.canvas.current.width = this.props.width;
    this.canvas.current.height = this.props.height;
    this.ctx = this.canvas.current.getContext('2d');
    this.ctx.lineWidth = 3;

    this.points = CanvasPoints.generatePoints(
      3,
      this.props.width,
      this.props.height
    );

    // init animation
    this.animate();
    for (var i in this.points) {
      this.shiftPoint(this.points[i]);
    }
  }

  componentDidUpdate() {
    this.canvas.current.width = this.props.width;
    this.canvas.current.height = this.props.height;
  }

  componentWillUnmount() {
    this.ctx = null;
  }

  animate = () => {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.props.width, this.props.height);
    for (var i in this.points) {
      this.drawLines(this.points[i]);
    }
    requestAnimationFrame(this.animate);
  };

  shiftPoint(point) {
    if (!this.ctx) return;
    TweenLite.to(point, 1 + 2 * Math.random(), {
      x: point.originX - 50 + Math.random() * 50,
      y: point.originY - 50 + Math.random() * 50,
      ease: Circ.easeInOut,
      onComplete: () => this.shiftPoint(point)
    });
  }

  // Canvas manipulation
  drawLines = point => {
    const ctx = this.ctx;

    for (var i in point.closest) {
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(point.closest[i].x, point.closest[i].y);
      ctx.strokeStyle = 'rgba(95,205,255,1)';
      ctx.stroke();
    }

    // draw circle
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.circleRadius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'rgba(95, 205, 255, 1)';
    ctx.fill();
  };

  render() {
    return <canvas className={this.props.className} ref={this.canvas} />;
  }

  static generatePoints(cuadrants, width, height) {
    const points = [];
    for (var x = 0; x < width; x = x + width / cuadrants) {
      for (var y = 0; y < height; y = y + height / cuadrants) {
        var px = x + (Math.random() * width) / cuadrants;
        var py = y + (Math.random() * height) / cuadrants;
        const circleRadius = 10 + Math.random() * 8;
        var p = { x: px, originX: px, y: py, originY: py, circleRadius };
        points.push(p);
      }
    }

    // for each point find the 5 closest points
    for (var i = 0; i < points.length; i++) {
      var closest = [];
      var p1 = points[i];
      for (var j = 0; j < points.length; j++) {
        var p2 = points[j];
        if (!(p1 == p2)) {
          var placed = false;
          for (var k = 0; k < 5; k++) {
            if (!placed) {
              if (closest[k] == undefined) {
                closest[k] = p2;
                placed = true;
              }
            }
          }

          for (var k = 0; k < 5; k++) {
            if (!placed) {
              if (
                CanvasPoints.getDistance(p1, p2) <
                CanvasPoints.getDistance(p1, closest[k])
              ) {
                closest[k] = p2;
                placed = true;
              }
            }
          }
        }
      }
      p1.closest = closest;
    }

    return points;
  }

  static getDistance(p1, p2) {
    return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
  }
}
