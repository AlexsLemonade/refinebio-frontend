import React from 'react';

import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { IoMdClose } from 'react-icons/io';
import {
  formatSentenceCase,
  formatPlatformName,
} from '../../../common/helpers';
import Button from '../../../components/Button';
import {
  toggleFilter,
  clearFilters,
  updateFilters,
  toggleFilterHelper,
} from '../../../state/search/actions';
import ResponsiveSwitch from '../../../components/ResponsiveSwitch';
import SideMenu from '../../../components/SideMenu';

import FilterIcon from '../../../common/icons/filter-icon.svg';
import { useDom } from '../../../common/hooks';
import { FilterCategory, SingleValueFilter } from './FilterCategory';
import cache from '../../../apiData.json';

export default function Filters({ appliedFilters }) {
  return (
    <ResponsiveSwitch
      mobile={() => <FiltersMobile appliedFilters={appliedFilters} />}
      desktop={() => <FiltersDesktop appliedFilters={appliedFilters} />}
    />
  );
}

let FilterList = ({
  appliedFilters,
  filters,
  onToggleFilter,
  onClearFilters,
  style,
}) => {
  const filterApplied = anyFilterApplied(appliedFilters);

  return (
    <div className="result-filters" style={style}>
      <div className="result-filters__title-container">
        <h2 className="result-filters__title">Filters</h2>

        {filterApplied && (
          <Button onClick={onClearFilters} buttonStyle="link">
            clear all
          </Button>
        )}
      </div>

      {!isEmpty(filters['organism']) && (
        <FilterCategory
          title="Organism"
          queryField="organism"
          filterValues={filters['organism']}
          activeValues={appliedFilters['organism']}
          formatValue={formatSentenceCase}
          onToggleFilter={onToggleFilter}
        />
      )}

      {!isEmpty(filters['technology']) && (
        <FilterCategory
          title="Technology"
          queryField="technology"
          filterValues={filters['technology']}
          activeValues={appliedFilters['technology']}
          formatValue={formatSentenceCase}
          onToggleFilter={onToggleFilter}
        />
      )}

      {!isEmpty(filters['platform']) && (
        <FilterCategory
          title="Platform"
          queryField="platform"
          filterValues={filters['platform']}
          activeValues={appliedFilters['platform']}
          formatValue={accessionCode =>
            formatPlatformName(cache.platforms[accessionCode] || accessionCode)
          }
          onToggleFilter={onToggleFilter}
        />
      )}

      {filters['has_publication'] && (
        <SingleValueFilter
          queryField="has_publication"
          filterLabel="Includes Publication"
          filterValue="true"
          filterActive={
            appliedFilters['has_publication'] &&
            appliedFilters['has_publication'].includes('true')
          }
          count={filters['has_publication']['true']}
          onToggleFilter={onToggleFilter}
        />
      )}
    </div>
  );
};
FilterList = connect(({ search: { filters } }) => ({ filters }))(FilterList);

let FiltersDesktop = ({
  appliedFilters,
  results,
  onToggleFilter,
  onClearFilters,
}) => {
  const ref = React.useRef();
  const size = useDom(ref, el => el.getBoundingClientRect());
  // If the user scrolls down the filters should be fixed on the screen
  // and also scrollable
  const style =
    size && size.top < 150 && results && results.length > 3
      ? {
          position: 'fixed',
          top: 150,
          width: size.width,
          overflowY: 'auto',
          bottom:
            size.bottom > window.innerHeight
              ? 0
              : window.innerHeight - size.bottom,
          paddingBottom: 200,
        }
      : null;

  return (
    <div className="results__filters" ref={ref}>
      <FilterList
        appliedFilters={appliedFilters}
        style={style}
        onToggleFilter={onToggleFilter}
        onClearFilters={onClearFilters}
      />
    </div>
  );
};
FiltersDesktop = connect(
  ({ search: { results } }) => ({ results }),
  { onToggleFilter: toggleFilter, onClearFilters: clearFilters }
)(FiltersDesktop);

/**
 * Mobile version of the filters. In this case we want to show the filters in a
 * side menu
 */
function FiltersMobile({
  appliedFilters,
  onToggleFilter,
  onClearFilters,
  onUpdateFilters,
}) {
  const [filters, setFilters] = React.useState([]);

  return (
    <SideMenu
      component={showMenu => (
        <div className="vertical-center">
          <Button onClick={showMenu} buttonStyle="secondary" className="mr-1">
            <div className="vertical-center">
              <img src={FilterIcon} className="button__icon" alt="" />
              <span>Filters</span>
            </div>
          </Button>

          {Object.keys(appliedFilters)
            .filter(filter =>
              ['organism', 'platform', 'technology'].includes(filter)
            )
            .map(filterKey =>
              appliedFilters[filterKey].map(filterValue => (
                <FilterLabel
                  key={`${filterKey}${filterValue}`}
                  value={filterValue}
                  onClick={() => onToggleFilter(filterKey, filterValue, false)}
                />
              ))
            )}
        </div>
      )}
    >
      {({ hideMenu }) => (
        <div>
          <Button
            className="side-menu__close"
            onClick={hideMenu}
            buttonStyle="transparent"
          >
            <IoMdClose className="icon" />
          </Button>

          <FilterList
            appliedFilters={filters}
            onToggleFilter={(type, value) =>
              setFilters(toggleFilterHelper(filters, type, value))
            }
            onClearFilters={() => {
              // if no changes were applied, there won't be any search and we want to reset the state filters
              setFilters(appliedFilters);
              onClearFilters();
              hideMenu();
            }}
          />

          <div className="flex-button-container">
            <Button
              onClick={() => {
                onUpdateFilters(filters);
                hideMenu();
              }}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </SideMenu>
  );
}
FiltersMobile = connect(
  null,
  {
    onToggleFilter: toggleFilter,
    onUpdateFilters: updateFilters,
    onClearFilters: clearFilters,
  }
)(FiltersMobile);

function FilterLabel({ value, onClick }) {
  return (
    <div className="filter-label mr-1">
      {formatSentenceCase(value)}
      <Button
        className="filter-label__remove"
        onClick={onClick}
        buttonStyle="transparent"
      >
        <IoMdClose className="icon" />
      </Button>
    </div>
  );
}

/**
 * Returns true if there's any filter active in `filters`
 */
export function anyFilterApplied(filters) {
  return Object.keys(filters)
    .map(x => filters[x])
    .some(x => x && x.length > 0);
}
