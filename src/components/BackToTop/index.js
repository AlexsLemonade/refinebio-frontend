import React, { Component } from 'react';
import Button from '../../components/Button';
import './BackToTop.scss';

class BackToTop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeClass: false
    };
  }
  handleScroll = () => {
    if (window.pageYOffset >= window.innerHeight / 2) {
      this.setState({
        activeClass: true
      });
    } else {
      this.setState({
        activeClass: false
      });
    }
  };
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
  render() {
    return (
      <Button
        buttonStyle="plain"
        className={`back-to-top ${
          this.state.activeClass ? 'back-to-top--active' : ''
        }`}
        onClick={() => window.scrollTo(0, 0)}
      >
        <i className="back-to-top__icon" />Back to Top
      </Button>
    );
  }
}

export default BackToTop;
