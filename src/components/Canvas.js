import React from 'react';

export default class Canvas extends React.Component {
  canvas = React.createRef();

  componentDidMount() {
    this.canvas.current.width = this.props.width;
    this.canvas.current.height = this.props.height;
    this.ctx = this.canvas.current.getContext('2d');

    this._drawCanvas();
  }

  componentDidUpdate() {
    this.canvas.current.width = this.props.width;
    this.canvas.current.height = this.props.height;
  }

  componentWillUnmount() {
    this.ctx = null;
  }

  _drawCanvas = () => {
    if (!this.ctx) return;

    this.props.draw(this.ctx);
    requestAnimationFrame(this._drawCanvas);
  };

  render() {
    return <canvas className={this.props.className} ref={this.canvas} />;
  }
}
