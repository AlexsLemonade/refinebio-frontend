import React, { Component } from 'react';

const ResultFilter = props => {
  return (
    <div>
      <h2>Filters</h2>
      <h3>Organism</h3>
      {props.organisms.map((organism, i) => (
        <label key={i}>
          <input type="checkbox" name={organism.name} id={organism.name} />
          {organism.name}
        </label>
      ))}
    </div>
  );
};

export default ResultFilter;
