import React from 'react';
import TechnologyBadge, {
  MICROARRAY,
  RNA_SEQ
} from '../../components/TechnologyBadge';
import uniq from 'lodash/uniq';
import Platform from '../Platform';

export default function Technology({ samples }) {
  return (
    <React.Fragment>
      <TechnologyBadge
        className="experiment__stats-icon"
        isMicroarray={samples.some(x => x.technology === MICROARRAY)}
        isRnaSeq={samples.some(x => x.technology === RNA_SEQ)}
      />
      {getTechnologies(samples)
        .map(code => <Platform accessionCode={code} />)
        .reduce((prev, curr) => [prev, ', ', curr])}
    </React.Fragment>
  );
}

export function getTechnologies(samples) {
  return uniq(samples.map(x => x.platform_accession_code));
}
