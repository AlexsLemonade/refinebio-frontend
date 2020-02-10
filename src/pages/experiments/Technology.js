import React from 'react';
import uniq from 'lodash/uniq';
import TechnologyBadge, {
  MICROARRAY,
  RNA_SEQ,
} from '../../components/TechnologyBadge';
import { formatPlatformName } from '../../common/helpers';

export default function Technology({ samples }) {
  if (!samples || !samples.length) return null;

  return (
    <React.Fragment>
      <TechnologyBadge
        className="experiment__stats-icon"
        isMicroarray={samples.some(x => x.technology === MICROARRAY)}
        isRnaSeq={samples.some(x => x.technology === RNA_SEQ)}
      />
      {getTechnologies(samples)
        .map(formatPlatformName)
        .join(', ')}
    </React.Fragment>
  );
}

export function getTechnologies(samples) {
  return uniq(samples.map(x => x.platform_name));
}
