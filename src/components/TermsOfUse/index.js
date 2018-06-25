import React, { Component } from 'react';
import Checkbox from '../Checkbox';
import { Link } from 'react-router-dom';
import './TermsOfUse.scss';

class TermsOfUse extends Component {
  state = {
    agreedToTerms: false
  };

  handleAgreedToTerms = () => {
    this.setState({ agreedToTerms: !this.state.agreedToTerms }, () => {
      localStorage.setItem('agreedToRefinebioTOS', this.state.agreedToTerms);
    });
  };

  render() {
    return (
      <div className="terms-of-use">
        <Checkbox
          className="terms-of-use__checkbox"
          onToggle={this.handleAgreedToTerms}
          checked={this.state.agreedToTerms}
          name="termsOfUse"
        >
          I agree to the{' '}
          <Link to="/terms" className="link">
            Terms of Use
          </Link>
        </Checkbox>
        <a
          href={this.props.downloadLink}
          className={`button ${
            !this.state.agreedToTerms ? 'button--disabled' : ''
          }`}
        >
          Download Now
        </a>
      </div>
    );
  }
}

export default TermsOfUse;
