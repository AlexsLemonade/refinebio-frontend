import React from 'react';
import './ResultFilters.scss';
import {
  formatSentenceCase,
  formatPlatformName
} from '../../../common/helpers';
import Button from '../../../components/Button';
import { connect } from 'react-redux';
import {
  toggledFilter,
  clearFilters,
  updateFilters,
  toggleFilterHelper
} from '../../../state/search/actions';
import ResponsiveSwitch from '../../../components/ResponsiveSwitch';
import SideMenu from '../../../components/SideMenu';

import FilterIcon from '../../../common/icons/filter-icon.svg';
import { useDom } from '../../../common/hooks';
import isEmpty from 'lodash/isEmpty';
import FilterCategory from './FilterCategory';

let FilterList = ({
  appliedFilters,
  filters,
  toggledFilter,
  clearFilters,
  style
}) => {
  let filterApplied = anyFilterApplied(appliedFilters);

  return (
    <div className="result-filters" style={style}>
      <div className="result-filters__title-container">
        <h2 className="result-filters__title">Filters</h2>

        {filterApplied && (
          <Button onClick={clearFilters} buttonStyle="link">
            clear all
          </Button>
        )}
      </div>
      {filterCategories.map(
        category =>
          !isEmpty(filters[category.name]) && (
            <FilterCategory
              key={category.name}
              categoryFilters={filters[category.name]}
              category={category}
              toggledFilter={toggledFilter}
              appliedFilters={appliedFilters}
            />
          )
      )}
    </div>
  );
};
FilterList = connect(({ search: { filters } }) => ({ filters }))(FilterList);

function FiltersDesktop(props) {
  const ref = React.useRef();
  const size = useDom(ref, el => el.getBoundingClientRect());

  // If the user scrolls down the filters should be fixed on the screen
  // and also scrollable
  const style =
    size && size.top < 150
      ? {
          position: 'fixed',
          top: 150,
          width: size.width,
          overflow: 'auto',
          bottom: size.bottom > 1550 ? 0 : Math.ceil(1550 - size.bottom),
          paddingBottom: 200
        }
      : null;

  return (
    <div className="results__filters" ref={ref}>
      <FilterList {...props} style={style} />
    </div>
  );
}
FiltersDesktop = connect(
  null,
  { toggledFilter, clearFilters }
)(FiltersDesktop);

let Filters = ({ appliedFilters }) => (
  <ResponsiveSwitch
    mobile={() => <FiltersMobile appliedFilters={appliedFilters} />}
    desktop={() => <FiltersDesktop appliedFilters={appliedFilters} />}
  />
);

export default Filters;

const filterCategories = [
  { name: 'organism', queryField: 'organism', format: formatSentenceCase },
  { name: 'technology', queryField: 'technology', format: formatSentenceCase },
  {
    name: 'publication',
    queryField: 'has_publication',
    format: formatSentenceCase
  },
  { name: 'platform', queryField: 'platform', format: formatPlatformName }
];

/**
 * Mobile version of the filters. In this case we want to show the filters in a
 * side menu
 */
class FiltersMobile extends React.Component {
  constructor(props) {
    super(props);

    // the filters object needs to be duplicated in this component's state, to allow
    // modifying the filters before clicking apply
    // in desktop we call the action creators directly
    this.state = {
      filters: props.appliedFilters
    };
  }

  render() {
    const { appliedFilters } = this.props;
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

            {Object.keys(appliedFilters).map(filterKey =>
              appliedFilters[filterKey].map(filterValue => (
                <FilterLabel
                  key={`${filterKey}${filterValue}`}
                  value={filterValue}
                  onClick={() =>
                    this.props.toggledFilter(filterKey, filterValue, false)
                  }
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
              <i className="icon ion-close" />
            </Button>

            <FilterList
              appliedFilters={this.state.filters}
              toggledFilter={(type, value) => this._toggleFilter(type, value)}
              clearFilters={() => {
                // if no changes were applied, there won't be any search and we want to reset the state filters
                this.setState({ filters: appliedFilters });
                this.props.clearFilters();
                hideMenu();
              }}
            />

            <div className="flex-button-container">
              <Button
                onClick={() => {
                  this.props.updateFilters(this.state.filters);
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

  _toggleFilter(type, value) {
    this.setState(({ filters }) => ({
      filters: toggleFilterHelper(filters, type, value)
    }));
  }
}
FiltersMobile = connect(
  () => ({}),
  {
    toggledFilter,
    updateFilters,
    clearFilters
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
        <i className="icon ion-close" />
      </Button>
    </div>
  );
}

export function anyFilterApplied(filters) {
  return Object.keys(filters)
    .map(x => filters[x])
    .some(x => x && x.length > 0);
}
