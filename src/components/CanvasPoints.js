import React from 'react';
import { TweenLite, Circ } from 'gsap';
import Canvas from './Canvas';

export default class CanvasPoints extends React.Component {
  canvas = React.createRef();

  constructor(props) {
    super(props);

    this.points = CanvasPoints.generatePoints(
      this.props.width,
      this.props.height
    );
  }

  componentDidMount() {
    this.points.forEach(this.animatePoints);
  }

  componentDidUpdate() {
    this.points = CanvasPoints.generatePoints(
      this.props.width,
      this.props.height
    );
    this.points.forEach(this.animatePoints);
  }

  drawCanvas = ctx => {
    ctx.lineWidth = 2;
    ctx.clearRect(0, 0, this.props.width, this.props.height);
    for (const point of this.points) {
      for (const closePoint of point.closest) {
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(closePoint.x, closePoint.y);
        ctx.strokeStyle = 'rgba(175, 196, 255, 1)';
        ctx.stroke();
      }

      // draw circle
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.circleRadius, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'rgba(175, 196, 255, 1)';
      ctx.fill();
    }
  };

  animatePoints = point => {
    if (!this.points.includes(point)) return;

    const duration = 4 + 2 * Math.random();

    TweenLite.to(point, duration, {
      x: point.originX - 50 + Math.random() * 50,
      y: point.originY - 50 + Math.random() * 50,
      ease: Circ.easeInOut,
      onComplete: () => {
        const wait = 2 + 1 * Math.random();
        setTimeout(() => this.animatePoints(point), wait);
      },
    });
  };

  render() {
    return (
      <Canvas
        className={this.props.className}
        width={this.props.width}
        height={this.props.height}
        draw={this.drawCanvas}
      />
    );
  }

  static generatePoints(width, height) {
    const points = [];
    const step = 45;
    for (let x = 0; x < width; x += step) {
      for (let y = 0; y < height; y += step) {
        const px = x + Math.random() * step;
        const py = y + Math.random() * step;
        const circleRadius = 5 + Math.random() * 3;
        const p = { x: px, originX: px, y: py, originY: py, circleRadius };
        points.push(p);
      }
    }

    // for each point find the 3 closest points
    for (const point of points) {
      point.closest = [...points]
        .sort(
          (p1, p2) =>
            CanvasPoints.getDistance(point, p1) -
            CanvasPoints.getDistance(point, p2)
        )
        .slice(1, 4);
    }

    return points;
  }

  static getDistance(p1, p2) {
    // get square of distance for sorting purposes
    return (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
  }
}
