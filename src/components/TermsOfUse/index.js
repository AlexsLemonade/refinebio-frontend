import React, { Component } from 'react';
import Checkbox from '../Checkbox';
import { Link } from 'react-router-dom';
import './TermsOfUse.scss';

class TermsOfUse extends Component {
  render() {
    const { agreedToTerms, handleToggle } = this.props;
    return (
      <div className="terms-of-use">
        <Checkbox
          className="terms-of-use__checkbox"
          onToggle={handleToggle}
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
