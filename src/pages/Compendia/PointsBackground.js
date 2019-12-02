import React from 'react';
import CanvasPoints from '../../components/CanvasPoints';

export default class PointsBackground extends React.Component {
  container = React.createRef();

  state = {
    width: 0,
    height: 0,
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
    setTimeout(this.handleWindowSizeChange, 0);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
    if (!this.container.current) return;

    this.setState({
      width: this.container.current.clientWidth,
      height: this.container.current.clientHeight,
    });
  };

  render() {
    return (
      <div ref={this.container} className="compendia__header-background">
        <CanvasPoints width={this.state.width} height={this.state.height} />
      </div>
    );
  }
}
