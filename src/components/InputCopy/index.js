import React from 'react';
import Button from '../Button';
import './InputCopy.scss';
import '../Input/Input.scss';
import { IoIosCheckmarkCircle } from 'react-icons/io';

// Creates an input with a copy button next to it, when the button is clicked the content of
// the input is copied to the keyboard.
export default class InputCopy extends React.Component {
  state = {
    alert: false,
  };

  render() {
    return (
      <div className="input-copy">
        {this.state.alert && (
          <div className="input-copy__alert">
            <IoIosCheckmarkCircle /> Copied to clipboard.
          </div>
        )}
        <div className="input-copy__row">
          <div className="input-copy__text">
            <input
              ref={input => (this._input = input)}
              type="text"
              className="input"
              value={this.props.value}
              readOnly
            />
          </div>
          <Button text="Copy" onClick={() => this._copy()} />
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
