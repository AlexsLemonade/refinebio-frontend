import React from 'react';
import Button from '../../../components/Button';
import AccessionIcon from '../../../common/icons/accession.svg';
import organismIcon from '../../../common/icons/organism.svg';
import sampleIcon from '../../../common/icons/sample.svg';
import './Result.scss';

const Result = ({ result }) => {
  return (
    <div className="result">
      <div className="result__title-container">
        <div className="result__title-info">
          <div className="result__accession">
            <img
              src={AccessionIcon}
              className="result__icon"
              alt="accession-icon"
            />{' '}
            {result.accession_code}
          </div>
          <h2 className="result__title">{result.title}</h2>
        </div>
        <Button text="Add to Dataset" />
      </div>
      <ul className="result__stats">
        <li className="result__stat">
          <img
            src={organismIcon}
            className="result__icon"
            alt="organism-icon"
          />{' '}
          {result.organisms.join(',')}
        </li>
        <li className="result__stat">
          <img src={sampleIcon} className="result__icon" alt="sample-icon" />{' '}
          {result.samples.length}
        </li>
        <li className="result__stat">
          <img
            src={organismIcon}
            className="result__icon"
            alt="organism-icon"
          />{' '}
          {result.platform_name.split(/(-|\s)/)[0]}
        </li>
      </ul>
      <h3>Description</h3>
      <p className="result__paragraph">{result.description}</p>
      <h3>Publication Title</h3>
      <p className="result__paragraph">{result.publication_title}</p>
      <h3>Sample Metadata Fields</h3>
      <p className="result__paragraph">todo...</p>
      <Button buttonStyle="secondary" text="View Samples" />
    </div>
  );
};

export default Result;
