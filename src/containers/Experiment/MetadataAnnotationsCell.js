import React from 'react';
import ModalManager from '../../components/Modal/ModalManager';
import Button from '../../components/Button';
import InfoIcon from '../../common/icons/info-badge.svg';

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
      {() => (
        <section>
          <h1 className="metadata-modal__title">Additional Metadata</h1>
          <div className="metadata-modal__subtitle">
            <img className="info-icon" src={InfoIcon} alt="" /> Included in
            Download
          </div>
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
        </section>
      )}
    </ModalManager>
  );
}
