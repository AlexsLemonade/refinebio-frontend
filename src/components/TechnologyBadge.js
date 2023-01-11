import React from 'react';
import Image from 'next/image';
import MicroArrayIcon from '../common/icons/microarray-badge.svg';
import PlatformMixedIcon from '../common/icons/platform-mixed.svg';
import RnaSeqIcon from '../common/icons/rna-seq.svg';

export default function TechnologyBadge({
  isMicroarray = false,
  isRnaSeq = false,
  className,
}) {
  const icon =
    isMicroarray && !isRnaSeq
      ? MicroArrayIcon
      : isRnaSeq
      ? RnaSeqIcon
      : PlatformMixedIcon;
  return <Image src={icon} className={className} alt="Technology Badge Icon" />;
}

export const MICROARRAY = 'MICROARRAY';

export const RNA_SEQ = 'RNA-SEQ';
