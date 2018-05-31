import React from 'react';
import './ResultFilters.scss';

const Filter = ({
  filterName,
  filterCount,
  toggledFilter,
  category,
  appliedFilters
}) => (
  <label className="filter">
    <input
      type="checkbox"
      name={filterName}
      id={filterName}
      checked={
        !!appliedFilters[category] && appliedFilters[category].has(filterName)
      }
      onChange={() => toggledFilter(category, filterName)}
    />
    {filterName} ({filterCount})
  </label>
);

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
        <Filter
          key={i}
          filterName={filter}
          category={categoryName}
          filterCount={categoryFilters[filter]}
          toggledFilter={toggledFilter}
          appliedFilters={appliedFilters}
        />
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
