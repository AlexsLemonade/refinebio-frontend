import React from 'react';
import './ResultFilters.scss';

const Filter = ({ filterName, filterCount, toggledFilter, category }) => (
  <label>
    <input
      type="checkbox"
      name={filterName}
      id={filterName}
      checked={false}
      onChange={() => toggledFilter(category, filterName)}
    />
    {filterName} {filterCount}
  </label>
);

const FilterCategory = ({ category, title, toggledFilter }) => (
  <div>
    <h3>{title}</h3>
    {Object.keys(category).map((filter, i) => (
      <Filter
        key={i}
        filterName={filter}
        category={category}
        filterCount={category[filter]}
        toggledFilter={toggledFilter}
      />
    ))}
  </div>
);

const ResultFilters = ({
  toggledFilter,
  organisms,
  filters,
  appliedFilters
}) => {
  return (
    <div className="result-filter">
      <div className="result-filter__title-container">
        <h2 className="result-filter__title">Filters</h2>
      </div>
      {Object.keys(filters).map((category, i) => (
        <FilterCategory
          key={i}
          category={filters[category]}
          title={category}
          toggledFilter={toggledFilter}
        />
      ))}
    </div>
  );
};

export default ResultFilters;
