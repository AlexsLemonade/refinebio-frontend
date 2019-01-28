import { push } from '../routerActions';
import { getQueryString, Ajax } from '../../common/helpers';
import reportError from '../reportError';
import { getUrlParams } from './reducer';

export const MOST_SAMPLES = 'MostSamples';

export const Ordering = {
  MostSamples: '', // default sorting, so no parameters needed
  LeastSamples: 'total_samples_count',
  Newest: '-source_first_published',
  Oldest: 'source_first_published'
};

// This action updates the current search url with new paramters, which in turn triggers a call
// to `fethResults` from the view. Components wanting to modify the search results should call this
// (or an action that call this) in order to update the search page. This way we ensure the flow is
// in a single direction, for example:
// new seach term -> triggers url change -> call fetchResults -> updates page
// Without this it's harder to keep the url in sync with the results.
const navigateToResults = ({
  query,
  page,
  size,
  filters,
  filterOrder,
  ordering
}) => {
  const urlParams = {
    q: query,
    p: page > 1 ? page : undefined,
    size: size !== 10 ? size : undefined,
    ordering: ordering !== Ordering.MostSamples ? ordering : undefined,
    filter_order:
      filterOrder && filterOrder.length > 0 ? filterOrder.join(',') : undefined,
    ...filters
  };

  return push({
    search: `${getQueryString(urlParams)}`
  });
};

export function fetchResults({
  query,
  page = 1,
  size = 10,
  ordering = Ordering.MostSamples,
  filterOrder = [],
  filters: appliedFilters
}) {
  return async (dispatch, getState) => {
    try {
      const { results, count: totalResults, facets } = await Ajax.get('/es/', {
        ...(query ? { search: query } : {}),
        limit: size,
        offset: (page - 1) * size,
        ...(ordering !== Ordering.MostSamples ? { ordering } : {}),
        ...appliedFilters
      });

      let filters = transformElasticSearchFacets(facets);

      if (filterOrder.length > 0) {
        // merge both filter objects to enable interactive filtering
        const lastFilterName = filterOrder[filterOrder.length - 1];
        let previousFilters = getState().search.filters;

        if (!previousFilters) {
          // make another request to the api to fetch the results
          const { facets: previousFacets } = await Ajax.get('/es/', {
            ...(query ? { search: query } : {}),
            limit: 1,
            ...{
              ...appliedFilters,
              [lastFilterName]: undefined
            }
          });
          previousFilters = transformElasticSearchFacets(previousFacets);
        }

        filters = {
          ...filters,
          // on the last filter category, use the numbers from the previous set
          // to enable interactive filtering
          [lastFilterName]: previousFilters[lastFilterName]
        };
      }

      dispatch({
        type: 'SEARCH_RESULTS_FETCH',
        data: {
          searchTerm: query,
          results,
          filters,
          filterOrder,
          totalResults,
          ordering,

          // these values come from the url, and are stored in redux after each search
          // to ease performing new searches from the action creators. Changes in the filters for
          // example keep the other parameters
          resultsPerPage: size,
          currentPage: page,
          appliedFilters
        }
      });
    } catch (error) {
      dispatch(reportError(error));
      // rethrow the error
      throw error;
    }
  };
}

/**
 * Ideally the filters should be formatted in the backend, but that seemed to be difficult
 * with elastic search https://github.com/AlexsLemonade/refinebio/pull/974#issuecomment-456533392
 */
function transformElasticSearchFacets(facets) {
  return {
    organism: transformFacet(
      facets['_filter_organism_names']['organism_names']
    ),
    technology: transformFacet(facets['_filter_technology']['technology']),
    publication: transformHasPublicationFacet(
      facets['_filter_has_publication']['has_publication']
    ),
    platforms: transformFacet(
      facets['_filter_platform_names']['platform_names']
    )
  };
}

function transformFacet(facet) {
  const result = {};
  for (let item of facet.buckets) {
    result[item.key] = item.doc_count;
  }

  return result;
}

function transformHasPublicationFacet(facet) {
  if (!facet.buckets || !facet.buckets.length) return null;
  const activeBucket = facet.buckets.find(bucket => bucket.key === 1);
  return activeBucket && { has_publication: activeBucket.doc_count };
}

export const triggerSearch = searchTerm => (dispatch, getState) => {
  const params = getUrlParams(getState());
  // when a new search is performed, remove the filters, and go back to the first page
  dispatch(
    navigateToResults({
      ...params,
      query: searchTerm,
      page: 1,
      filters: {},
      ordering: Ordering.MostSamples
    })
  );
};

/**
 * Toggles a given filter
 * @param {string} filterType Name of the filter to be applied
 * @param {string} filterValue Value of the filter
 * @param {boolean} trackOrder Allow disabling interactive filtering (used on mobile devices)
 */
export function toggledFilter(filterType, filterValue, trackOrder = true) {
  return (dispatch, getState) => {
    const { filters, filterOrder } = getUrlParams(getState());
    const newFilters = toggleFilterHelper(filters, filterType, filterValue);
    const newFilterOrder = trackOrder
      ? updateFilterOrderHelper({
          filters,
          type: filterType,
          value: filterValue,
          filterOrder
        })
      : [];

    dispatch(updateFilters(newFilters, newFilterOrder));
  };
}

export const updateFilters = (newFilters, filterOrder = []) => (
  dispatch,
  getState
) => {
  const params = getUrlParams(getState());

  // reset to the first page when a filter is applied
  dispatch(
    navigateToResults({
      ...params,
      page: 1,
      filterOrder: filterOrder,
      filters: newFilters
    })
  );
};

export const clearFilters = () => dispatch => {
  let newFilters = {};
  dispatch(updateFilters(newFilters));
};

export const updateOrdering = newOrdering => (dispatch, getState) => {
  const params = getUrlParams(getState());
  // reset to the first page when a filter is applied
  dispatch(
    navigateToResults({
      ...params,
      page: 1,
      ordering: newOrdering
    })
  );
};

export const updatePage = page => async (dispatch, getState) => {
  const params = getUrlParams(getState());
  dispatch(
    navigateToResults({
      ...params,
      page
    })
  );
};

export const updateResultsPerPage = resultsPerPage => async (
  dispatch,
  getState
) => {
  const params = getUrlParams(getState());
  dispatch(
    navigateToResults({
      ...params,
      size: resultsPerPage
    })
  );
};

/**
 * Takes an array with specifications of active filters and toggles one of the filters.
 * @param {any} filters Filters object, where the keys are the name of the filter
 *                      And the values are the active filters.
 * @param {string} type name of the filter to be toggled
 * @param {string} value value of the filter
 */
export function toggleFilterHelper(filters, type, value) {
  const prevFilterValue = filters[type];

  // modify the filter's object value
  let appliedFilterType;
  if (!prevFilterValue) {
    // if it doesn't exist, create the add the filter
    appliedFilterType = [value];
  } else if (prevFilterValue.includes(value)) {
    // if the filter is active, remove it from the list
    appliedFilterType = prevFilterValue.filter(x => x !== value);
  } else {
    // otherwise just add it
    appliedFilterType = [...prevFilterValue, value];
  }

  const newFilters = {
    ...filters,
    [type]: appliedFilterType
  };

  return newFilters;
}

export function updateFilterOrderHelper({
  filters,
  type,
  value,
  filterOrder = []
}) {
  // check if the filter has been applied, in which case it should be removed from the order
  if (filters[type] && filters[type].includes(value)) {
    const filterIndex = filterOrder.lastIndexOf(type);
    if (filterIndex >= 0) {
      return filterOrder
        .slice(0, filterIndex)
        .concat(filterOrder.slice(filterIndex + 1, filterOrder.length));
    }
  }

  // otherwise just add it to the filterOrder array
  return [...filterOrder, type];
}
