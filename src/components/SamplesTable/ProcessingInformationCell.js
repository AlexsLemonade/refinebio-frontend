import React from 'react';
import moment from 'moment';
import Button from '../Button';
import ModalManager from '../Modal/ModalManager';
import ProcessingInformationModalContent from './ProcessingInformation/ProcessingInformationModalContent';

export default function ProcessingInformationCell({ original: sample }) {
  if (!sample.results || !sample.results.length) {
    return <div className="experiment__not-provided">NA</div>;
  }

  const computationalResults = prepareSampleComputationalResults(
    sample.results
  );

  const pipelinesText = computationalResults
    .map(result => result.processor.name)
    .join(', ');

  return (
    <ModalManager
      component={showModal => (
        <Button text={pipelinesText} buttonStyle="link" onClick={showModal} />
      )}
      modalProps={{ className: 'processing-info-modal' }}
    >
      {() => (
        <ProcessingInformationModalContent
          sample={sample}
          results={computationalResults}
        />
      )}
    </ModalManager>
  );
}

const PROCESSOR_BLACKLIST = ['MultiQC', 'Salmontools'];

/**
 * Get the lost of ComputationalResults that should be displayed in the modal dialog
 * @param {*} computationalResults
 */
function prepareSampleComputationalResults(computationalResults) {
  return computationalResults
    .filter(result => !PROCESSOR_BLACKLIST.includes(result.processor.name))
    .filter(
      // hack: the backend is returning duplicated computational results
      // this ensures we only show unique values.
      (result, index, self) =>
        self.findIndex(r2 => r2.processor.name === result.processor.name) ===
        index
    )
    .sort((result1, result2) =>
      moment(result1.time_start).diff(moment(result2.time_start))
    );
}
