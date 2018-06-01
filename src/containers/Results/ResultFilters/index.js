import React from 'react';
import './ResultFilters.scss';
import Checkbox from '../../../components/Checkbox';
import { formatSentenceCase } from '../../../common/helpers';

const FilterCategory = ({
  categoryFilters,
  categoryName,
  toggledFilter,
  appliedFilters
}) => (
  <section className="result-filters__section">
    <h3 className="result-filters__title">{categoryName}</h3>
    {categoryFilters &&
      Object.keys(categoryFilters).map((filter, i) => (
        <Checkbox
          key={i}
          name={filter}
          onToggle={() => toggledFilter(categoryName, filter)}
          checked={
            !!appliedFilters[categoryName] &&
            appliedFilters[categoryName].has(filter)
          }
        >
          {formatSentenceCase(filter)} ({categoryFilters[filter]})
        </Checkbox>
      ))}
  </section>
);

const ResultFilters = ({
  toggledFilter,
  organisms,
  filters,
  appliedFilters
}) => {
  return (
    <div className="result-filters">
      <div className="result-filters__title-container">
        <h2 className="result-filters__title">Filters</h2>
      </div>
      {filterCategories.map((category, i) => (
        <FilterCategory
          key={i}
          categoryFilters={filters[category]}
          categoryName={category}
          toggledFilter={toggledFilter}
          appliedFilters={appliedFilters}
        />
      ))}
    </div>
  );
};

const filterCategories = ['organism', 'technology', 'publication'];

export default ResultFilters;
