import React from 'react';
import { formatSentenceCase } from '../../../common/helpers';
import Checkbox from '../../../components/Checkbox';
import Button from '../../../components/Button';
import { InputSearch } from '../../../components/Input';
import HighlightedText from '../../../components/HighlightedText';

const MAX_FILTERS = 6;

class FilterCategory extends React.Component {
  state = {
    query: '',
    collapsed: true
  };

  render() {
    const {
      categoryFilters,
      category,
      toggledFilter,
      appliedFilters
    } = this.props;
    const filters = Object.keys(categoryFilters);

    return (
      <section className="result-filters__section">
        <h3 className="result-filters__title">{category.name}</h3>

        {filters.length > MAX_FILTERS && (
          <InputSearch
            onChange={query => this.setState({ query })}
            className="result-filters__search-input"
          />
        )}

        {filters
          .filter(filter =>
            formatSentenceCase(filter)
              .toLocaleLowerCase()
              .includes(this.state.query.toLocaleLowerCase())
          )
          // Sort filters by the number of samples in descending order
          .sort((a, b) => categoryFilters[b] - categoryFilters[a])
          .slice(
            0,
            this.state.collapsed && !this.state.query
              ? MAX_FILTERS
              : filters.length
          )
          .map(
            filter =>
              filter && filter !== 'null' ? ( // Make sure filter is not null
                // The `filter !== "null"` check is required because a null organism
                // is not `null`, it is `"null"`
                <Checkbox
                  key={filter}
                  name={filter}
                  className="result-filters__filter-check"
                  disabled={categoryFilters[filter] === 0}
                  onChange={() =>
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
                  <HighlightedText
                    text={category.format(filter)}
                    highlight={this.state.query}
                  />{' '}
                  <span className="nowrap">({categoryFilters[filter]})</span>
                </Checkbox>
              ) : null // Do not display a checkbox if the filter is null
          )}

        {filters.length > MAX_FILTERS && !this.state.query && (
          <Button
            text={
              this.state.collapsed
                ? `+ ${filters.length - MAX_FILTERS} more`
                : `- see less`
            }
            buttonStyle="link"
            onClick={() =>
              this.setState(state => ({ collapsed: !state.collapsed }))
            }
          />
        )}
      </section>
    );
  }
}

export default FilterCategory;
