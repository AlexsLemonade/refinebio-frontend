import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Checkbox from '../Checkbox';
import './TermsOfUse.scss';

class TermsOfUse extends Component {
  render() {
    const { agreedToTerms, handleToggle } = this.props;
    return (
      <div className="terms-of-use">
        <Checkbox
          className="terms-of-use__checkbox"
          onChange={handleToggle}
          checked={agreedToTerms}
          name="termsOfUse"
        >
          I agree to the{' '}
          <Link to="/terms" className="link">
            Terms of Use
          </Link>
        </Checkbox>
      </div>
    );
  }
}

export default TermsOfUse;
