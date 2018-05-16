import React from 'react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import './InputCopy.scss';

export default class InputCopy extends React.Component {
  state = {
    alert: false
  };

  render() {
    return (
      <div className="input-copy">
        {this.state.alert && (
          <div className="input-copy__alert">
            <i className="ion-checkmark-circled" /> Copied to clipboard.
          </div>
        )}
        <div>
          <Button
            text="Copy"
            className="input-copy__btn"
            onClick={() => this._copy()}
          />
          <div className="input-copy__text">
            <input
              ref={input => (this._input = input)}
              type="text"
              className="input"
              value={this.props.value}
              readOnly
            />
          </div>
        </div>
      </div>
    );
  }

  _copy() {
    this._input.focus();
    this._input.select();
    document.execCommand('copy');

    // show a message that the text was copied successfully
    this.setState({ alert: true });
    clearTimeout(this._alertTimeout);
    // in 5 seconds remove the alert
    this._alertTimeout = setTimeout(() => {
      this.setState({ alert: false });
    }, 5000);
  }
}
