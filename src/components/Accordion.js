import React from 'react';
import classnames from 'classnames';
import Button from './Button';
import Checkbox from './Checkbox';
import './Accordion.scss';

export class Accordion extends React.Component {
  state = {
    activeElements: []
  };

  componentDidMount() {
    this.setState({
      activeElements: new Array(this._totalChildren()).fill(false)
    });
  }

  render() {
    let children = React.Children.map(this.props.children, (child, index) =>
      React.cloneElement(child, {
        isExpanded: this.state.activeElements[index],
        onToggle: () => this._toggleElement(index)
      })
    );
    return (
      <div>
        {!this.props.hideExpandAll && (
          <Checkbox
            className="accordion__expand-all"
            onClick={() => this._toggleAll()}
            checked={!this.state.activeElements.includes(false)}
            name="expand-all"
            readOnly
          >
            Expand all
          </Checkbox>
        )}

        {children}
      </div>
    );
  }

  _toggleAll() {
    if (!this.state.activeElements.includes(false)) {
      this.setState({
        activeElements: new Array(this._totalChildren()).fill(false)
      });
    } else {
      this.setState({
        activeElements: new Array(this._totalChildren()).fill(true)
      });
    }
  }

  _toggleElement(index) {
    this.setState(state => ({
      activeElements: state.activeElements.map((x, i) => (i === index ? !x : x))
    }));
  }

  _totalChildren() {
    return React.Children.count(this.props.children);
  }
}

export function AccordionItem({ title, children, onToggle, isExpanded }) {
  return (
    <div className={classnames('accordion-item')}>
      <div className="accordion-item__header">
        <div className="accourdion-item__title">{title(isExpanded)}</div>

        <Button onClick={onToggle} buttonStyle="transparent">
          {isExpanded ? (
            <i className="ion-chevron-up" />
          ) : (
            <i className="ion-chevron-down" />
          )}
        </Button>
      </div>

      <div
        className={classnames('accordion-item__content', {
          hidden: !isExpanded
        })}
      >
        {children}
      </div>
    </div>
  );
}
