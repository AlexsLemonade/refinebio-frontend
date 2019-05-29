import React, { Component } from 'react';
import { IoIosArrowUp } from 'react-icons/io';
import Button from '../Button';
import './BackToTop.scss';

class BackToTop extends Component {
  state = {
    activeClass: false,
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    if (window.pageYOffset >= window.innerHeight / 2) {
      this.setState({
        activeClass: true,
      });
    } else {
      this.setState({
        activeClass: false,
      });
    }
  };

  render() {
    return (
      <Button
        buttonStyle="plain"
        className={`back-to-top ${
          this.state.activeClass ? 'back-to-top--active' : ''
        }`}
        onClick={() => window.scrollTo(0, 0)}
      >
        <div className="back-to-top__icon">
          <IoIosArrowUp />
        </div>
        Back to Top
      </Button>
    );
  }
}

export default BackToTop;
