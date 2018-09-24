import React from 'react';
import classnames from 'classnames';
import Button from './Button';
import './Accordion.scss';

export class Accordion extends React.Component {
  state = {
    activeElements: {}
  };

  render() {
    let children = React.Children.map(this.props.children, (child, index) =>
      React.cloneElement(child, {
        isExpanded: this.state.activeElements[index],
        onToggle: () =>
          this.setState(state => ({
            activeElements: {
              ...state.activeElements,
              [index]: !state.activeElements[index]
            }
          }))
      })
    );
    return <div>{children}</div>;
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
