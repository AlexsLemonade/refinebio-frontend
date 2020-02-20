import React from 'react';
import isNumber from 'lodash/isNumber';
import classnames from 'classnames';
import Checkbox from '../../../components/Checkbox';
import Button from '../../../components/Button';
import { InputSearch } from '../../../components/Input';
import HighlightedText from '../../../components/HighlightedText';
import { useLocalStorage } from '../../../common/hooks';

const MAX_FILTERS = 6;

/**
 * Represent a set of filters for one `queryField`
 * @param queryField
 */
export function FilterCategory({
  title = false,
  queryField,
  filterValues,
  activeValues,
  formatValue = x => x,
  onToggleFilter,
}) {
  const [query, setQuery] = React.useState('');
  const [savedQuery, setSavedQuery] = useLocalStorage(
    `saved-search-filter-query-${title}`,
    false
  );
  const [collapsed, setCollapsed] = React.useState(true);
  React.useEffect(() => {
    if (!query.length && savedQuery) {
      setQuery(savedQuery);
      setSavedQuery(false);
    }
  }, [savedQuery, setSavedQuery, query, setQuery]);
  // create an array with all the filter values, sometimes the API returns
  // a `'null'` value which we want to ignore.
  const filters = Object.keys(filterValues).filter(x => x !== 'null');

  const filtersToDisplay = filters
    .filter(filter =>
      formatValue(filter)
        .toLocaleLowerCase()
        .includes(query.toLocaleLowerCase())
    )
    // Sort filters by the number of samples in descending order
    .sort((a, b) => filterValues[b] - filterValues[a])
    .slice(0, collapsed && !query ? MAX_FILTERS : filters.length);

  return (
    <section className="result-filters__section">
      {title && <h3 className="result-filters__title">{title}</h3>}

      {filters.length > MAX_FILTERS && (
        <InputSearch
          value={query}
          onChange={newQuery => setQuery(newQuery)}
          className="result-filters__search-input"
        />
      )}

      {filtersToDisplay.map(filter => (
        <Checkbox
          key={filter}
          name={filter}
          className="result-filters__filter-check"
          onChange={() => {
            setSavedQuery(query);
            onToggleFilter(queryField, filter);
          }}
          checked={!!activeValues && activeValues.includes(filter)}
        >
          <HighlightedText text={formatValue(filter)} highlight={query} />
          <span className="nowrap"> ({filterValues[filter]})</span>
        </Checkbox>
      ))}

      {filters.length > MAX_FILTERS && !query && (
        <Button
          text={
            collapsed ? `+ ${filters.length - MAX_FILTERS} more` : `- see less`
          }
          buttonStyle="link"
          onClick={() => setCollapsed(!collapsed)}
        />
      )}
    </section>
  );
}

export function SingleValueFilter({
  queryField,
  filterLabel,
  filterValue,
  count = null,
  filterActive,
  className,
  onToggleFilter,
}) {
  return (
    <section className={classnames('result-filters__section', className)}>
      <Checkbox
        name={queryField}
        className="result-filters__filter-check"
        onChange={() => onToggleFilter(queryField, filterValue, false)}
        checked={filterActive}
      >
        {filterLabel}
        {isNumber(count) && <span className="nowrap"> ({count})</span>}
      </Checkbox>
    </section>
  );
}
