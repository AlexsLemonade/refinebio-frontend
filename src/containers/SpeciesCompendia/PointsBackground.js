import React from 'react';
import CanvasPoints from '../../components/CanvasPoints';

export default class PointsBackground extends React.Component {
  container = React.createRef();
  state = {
    width: 0,
    height: 0
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
    setTimeout(this.handleWindowSizeChange, 0);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
    this.setState({
      width: this.container.current.clientWidth,
      height: this.container.current.clientHeight
    });
  };

  render() {
    return (
      <div
        ref={this.container}
        className="species-compendia__header-background"
      >
        {this.state.width > 0 &&
          this.state.height > 0 && (
            <CanvasPoints
              width={this.state.width}
              height={this.state.height}
              cuadrants={this.getCuadrants()}
            />
          )}
      </div>
    );
  }

  getCuadrants() {
    if (this.state.width < 600) {
      return 9;
    } else if (this.state.width > 2200) {
      return this.state.width / 140;
    }

    return this.state.width / 90;
  }
}
