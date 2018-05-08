import React from 'react';
import Button from '../../components/Button';

const Result = ({ result }) => {
  return (
    <div>
      <div>
        <div>
          {result.accession_code}
          <h2>{result.title}</h2>
        </div>
        <Button text="Add to Dataset" />
        <ul>
          <li>{result.organisms.join(',')}</li>
          <li>{result.samples.length}</li>
          <li>{result.platform_name}</li>
        </ul>
        <h3>Description</h3>
        <p>{result.description}</p>
        <h3>Publication Title</h3>
        <p>{result.publication_title}</p>
        <h3>Sample Metadata Fields</h3>
        <p>todo...</p>
        <Button buttonStyle="secondary" text="View Samples" />
      </div>
      <p>{result.title}</p>
    </div>
  );
};

export default Result;
