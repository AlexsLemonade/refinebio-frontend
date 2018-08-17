import React from 'react';
import './ResultFilters.scss';
import Checkbox from '../../../components/Checkbox';
import { formatSentenceCase } from '../../../common/helpers';

const FilterCategory = ({
  categoryFilters,
  category,
  toggledFilter,
  appliedFilters
}) => (
  <section className="result-filters__section">
    <h3 className="result-filters__title">{category.name}</h3>
    {categoryFilters &&
      Object.keys(categoryFilters).map(
        (filter, i) =>
          filter && filter !== 'null' ? ( // Make sure filter is not null
            // The `filter !== "null"` check is required because a null organism
            // is not `null`, it is `"null"`
            <Checkbox
              key={i}
              name={filter}
              disabled={categoryFilters[filter] === 0}
              onToggle={() =>
                toggledFilter(
                  category.queryField,
                  filter === 'has_publication' ? 'true' : filter
                )
              }
              checked={
                !!appliedFilters[category.queryField] &&
                appliedFilters[category.queryField].includes(
                  filter === 'has_publication' ? 'true' : filter
                )
              }
            >
              {formatSentenceCase(filter)} ({categoryFilters[filter]})
            </Checkbox>
          ) : null // Do not display a checkbox if the filter is null
      )}
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
          categoryFilters={filters[category.name]}
          category={category}
          toggledFilter={toggledFilter}
          appliedFilters={appliedFilters}
        />
      ))}
    </div>
  );
};

const filterCategories = [
  { name: 'organism', queryField: 'organisms__name' },
  { name: 'technology', queryField: 'technology' },
  { name: 'publication', queryField: 'has_publication' }
];

export default ResultFilters;
