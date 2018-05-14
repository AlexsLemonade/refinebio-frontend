import React from 'react';
import './ResultFilter.scss';

const ResultFilter = ({ toggledFilter, organisms, filters }) => {
  return (
    <div className="result-filter">
      <div className="result-filter__title-container">
        <h2 className="result-filter__title">Filters</h2>
      </div>
      <h3>Organism</h3>
      {organisms.map((organism, i) => (
        <label key={i}>
          <input
            type="checkbox"
            name={organism.name}
            id={organism.name}
            checked={
              filters['organism'] && filters['organisms'].has(organism.name)
            }
            onChange={() => toggledFilter('organisms', organism.name)}
          />
          {organism.name}
        </label>
      ))}
    </div>
  );
};

export default ResultFilter;
