import React from 'react';
import './ResultFilters.scss';
import Checkbox from '../../../components/Checkbox';
import { formatSentenceCase } from '../../../common/helpers';
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

let FilterList = ({ appliedFilters, filters, toggledFilter, clearFilters }) => {
  let anyFilterApplied = Object.keys(appliedFilters)
    .map(x => appliedFilters[x])
    .some(x => x && x.length > 0);

  return (
    <div className="result-filters">
      <div className="result-filters__title-container">
        <h2 className="result-filters__title">Filters</h2>

        {anyFilterApplied && (
          <Button onClick={clearFilters} buttonStyle="link">
            clear all
          </Button>
        )}
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
FilterList = connect(({ search: { filters } }) => ({ filters }))(FilterList);

let FiltersDesktop = connect(
  () => ({}),
  {
    toggledFilter,
    clearFilters
  }
)(FilterList);

let Filters = ({ appliedFilters }) => (
  <ResponsiveSwitch
    mobile={() => <FiltersMobile appliedFilters={appliedFilters} />}
    desktop={() => <FiltersDesktop appliedFilters={appliedFilters} />}
  />
);

export default Filters;

const filterCategories = [
  { name: 'organism', queryField: 'organisms__name' },
  { name: 'technology', queryField: 'technology' },
  { name: 'publication', queryField: 'has_publication' }
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
    return (
      <SideMenu
        component={showMenu => (
          <Button
            onClick={showMenu}
            buttonStyle="secondary"
            className="tablet-p"
          >
            Filters
          </Button>
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
                this.setState({ filters: this.props.appliedFilters });
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
    updateFilters,
    clearFilters
  }
)(FiltersMobile);
