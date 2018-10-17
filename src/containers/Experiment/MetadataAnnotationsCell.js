import React from 'react';
import ModalManager from '../../components/Modal/ModalManager';
import Button from '../../components/Button';
import InfoIcon from '../../common/icons/info-badge.svg';
import pickBy from 'lodash/pickBy';
import Input from '../../components/Input';

import './MetadataAnnotationsCell.scss';

/**
 * Component that renders the content in "Additional Metadata" column on the Samples Table
 */
export default function MetadataAnnotationsCell({ original: sample }) {
  if (sample.annotations.length === 0) {
    return <div className="experiment__not-provided">NA</div>;
  }

  let annotations = sample.annotations.map(entry => entry.data);
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
    filter: ''
  };

  render() {
    let annotations = this._getAnnotations();
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

          <div className="metadata-modal__subtitle">
            <img className="info-icon" src={InfoIcon} alt="" /> Sample Metadata
            included in Download
          </div>
        </div>

        {anyAnnotationsMatchingFilter ? (
          <div className="metadata-modal__annotations">
            {annotations.map((meta, index) => (
              <div key={index}>
                {Object.keys(meta).map(field => (
                  <div className="experiment__row" key={field}>
                    <div className="experiment__row-label">{field}</div>
                    <div>
                      {Array.isArray(meta[field])
                        ? meta[field].map(value => <p>{value}</p>)
                        : meta[field]}
                    </div>
                  </div>
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
