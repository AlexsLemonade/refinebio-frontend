import React from 'react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import './InputCopy.scss';

export default class InputCopy extends React.Component {
  render() {
    return (
      <div className="input-copy">
        <Button text="Copy" className="input-copy__btn" />

        <div className="input-copy__text">
          <Input value={this.props.value} />
        </div>
      </div>
    );
  }
}
