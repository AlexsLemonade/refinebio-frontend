import React from 'react';
import pickBy from 'lodash/pickBy';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import ModalManager from '../Modal/ModalManager';
import Button from '../Button';
import InfoIcon from '../../common/icons/info-badge.svg';
import Input from '../Input';
import './MetadataAnnotationsCell.scss';
import fromPairs from 'lodash/fromPairs';
import { isValidURL } from '../../common/helpers';
import HighlightedText from '../HighlightedText';

/**
 * Component that renders the content in "Additional Metadata" column on the Samples Table
 */
export default function MetadataAnnotationsCell({ original: sample }) {
  if (sample.annotations.length === 0) {
    return <div className="experiment__not-provided">NA</div>;
  }

  const annotations = sample.annotations.map(entry => entry.data);
  return (
    <ModalManager
      component={showModal => (
        <Button text="View" buttonStyle="link" onClick={showModal} />
      )}
      modalProps={{ className: 'metadata-modal' }}
    >
      {() => <AnnotationsModalContent annotations={annotations} />}
    </ModalManager>
  );
}

class AnnotationsModalContent extends React.Component {
  state = {
    filter: '',
  };

  render() {
    const annotations = this._getAnnotations();
    const anyAnnotationsMatchingFilter = annotations.some(
      meta => Object.keys(meta).length > 0
    );

    return (
      <section>
        <h1 className="metadata-modal__title">Additional Metadata</h1>
        <div className="metadata-modal__filter-wrap">
          <div className="metadata-modal__filter">
            <div>Filter</div>
            <Input
              onChange={filter => this.setState({ filter })}
              className="input metadata-modal__filter-input"
            />
          </div>

          <div className="metadata-modal__subtitle info">
            <img className="info__icon" src={InfoIcon} alt="" /> Sample metadata
            included in download
          </div>
        </div>

        {anyAnnotationsMatchingFilter ? (
          <div className="metadata-modal__annotations">
            {annotations.map((meta, index) => (
              <div key={index}>
                {Object.keys(meta).map(field => (
                  <Annotation
                    key={field}
                    field={field}
                    value={meta[field]}
                    highlight={this.state.filter}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="metadata-modal__no-match">
            No metadata found matching <b>{this.state.filter}</b>.
          </div>
        )}
      </section>
    );
  }

  _getAnnotations() {
    return this.props.annotations.map(meta =>
      pickBy(
        meta,
        (value, key) =>
          JSON.stringify(value)
            .toLocaleLowerCase()
            .includes(this.state.filter.toLocaleLowerCase()) ||
          key
            .toLocaleLowerCase()
            .includes(this.state.filter.toLocaleLowerCase())
      )
    );
  }
}

function Annotation({ field, value, highlight = '' }) {
  if (Array.isArray(value) && value.length === 1) {
    return <Annotation field={field} value={value[0]} highlight={highlight} />;
  }

  // check if it's an array with key/values. Basically objects with only two keys and
  // one of them is `value`
  if (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(item => Object.keys(item).length === 2 && !!item.value)
  ) {
    const valueAsObject = fromPairs(
      value.map(item => {
        const keyParam = Object.keys(item).find(x => x !== 'value');
        return [item[keyParam], item.value];
      })
    );

    return (
      <Annotation field={field} value={valueAsObject} highlight={highlight} />
    );
  }

  const valueIsObject = Array.isArray(value) || !isObject(value);

  return (
    <div className="metadata-item">
      <div className="metadata-item__row">
        <div className="experiment__row-label">{field}</div>
        {valueIsObject && (
          <div>
            <AnnotationValue value={value} highlight={highlight} />
          </div>
        )}
      </div>
      {!valueIsObject &&
        Object.keys(value).map(subField => (
          <div className="metadata-item__row">
            <div className="experiment__row-label experiment__row-label--light">
              <HighlightedText text={subField} highlight={highlight} />
            </div>
            <div>
              <AnnotationValue value={value[subField]} highlight={highlight} />
            </div>
          </div>
        ))}
    </div>
  );
}

function AnnotationValue({ value, level = 0, highlight = '' }) {
  if (isString(value)) {
    return <AnnotationText value={value} highlight={highlight} />;
  }
  if (Array.isArray(value)) {
    return value.map((x, index) => (
      <div key={index} style={{ marginTop: index > 0 ? 8 : 0 }}>
        <AnnotationValue value={x} highlight={highlight} />
      </div>
    ));
  }
  if (isObject(value)) {
    if (Object.keys(value).length === 2 && !!value.value) {
      const keyParam = Object.keys(value).find(x => x !== 'value');
      return (
        <React.Fragment>
          <HighlightedText text={value[keyParam]} highlight={highlight} />
          {': '}
          <AnnotationText value={value.value} highlight={highlight} />
        </React.Fragment>
      );
    }

    return Object.keys(value).map(key => (
      <div key={key}>
        <b>
          <HighlightedText text={key} highlight={highlight} />
        </b>{' '}
        <AnnotationValue value={value[key]} highlight={highlight} />
      </div>
    ));
  }
  // it's a single value
  return value;
}

function AnnotationText({ value, highlight = '' }) {
  if (isString(value)) {
    if (isValidURL(value)) {
      return (
        <a
          href={value}
          rel="nofollow noopener noreferrer"
          target="_blank"
          className="link"
        >
          {value}
        </a>
      );
    }

    return <HighlightedText text={value} highlight={highlight} />;
  }

  return <code>{JSON.stringify(value)}</code>;
}
