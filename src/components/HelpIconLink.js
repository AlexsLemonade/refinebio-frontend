import React from 'react';
import Image from 'next/image';
import HelpIconImage from '../common/icons/help.svg';

export const HelpIconLink = ({
  url = '//docs.refine.bio/',
  alt = 'What is this?',
}) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title={alt}
      className="downloads__help-icon"
    >
      <Image src={HelpIconImage} alt={alt} />
    </a>
  );
};

export default HelpIconLink;
