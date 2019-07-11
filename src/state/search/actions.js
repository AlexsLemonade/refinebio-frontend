import uniqBy from 'lodash/uniqBy';
import { push } from '../routerActions';
import {
  getQueryString,
  Ajax,
  getQueryParamObject,
} from '../../common/helpers';
import reportError from '../reportError';
import { getUrlParams } from './reducer';

export const MOST_SAMPLES = 'MostSamples';

export const Ordering = {
  BestMatch: '_score',
  MostSamples: '-num_downloadable_samples',
  LeastSamples: 'num_downloadable_samples',
  Newest: '-source_first_published',
  Oldest: 'source_first_published',
};

export function parseUrl(locationSearch) {
  /* eslint-disable prefer-const */
  let {
    q: query,
    p: page = 1,
    size = 10,
    ordering = Ordering.BestMatch,
    filter_order: filterOrder = '',
    ...filters
  } = getQueryParamObject(locationSearch);
  /* eslint-enable */

  // for consistency, ensure all values in filters are arrays
  // the method `getQueryParamObject` will return a single value for parameters that only
  // appear once in the url
  for (const key of Object.keys(filters)) {
    if (!Array.isArray(filters[key])) {
      filters[key] = [filters[key]];
    }
  }

  // parse parameters from url
  query = query ? decodeURIComponent(query) : undefined;
  page = parseInt(page, 10);
  size = parseInt(size, 10);
  filterOrder = filterOrder ? filterOrder.split(',') : [];

  return { query, page, size, ordering, filters, filterOrder };
}

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
  ordering,
}) => {
  const urlParams = {
    q: query,
    p: page > 1 ? page : undefined,
    size: size !== 10 ? size : undefined,
    ordering:
      ordering !== '' && ordering !== Ordering.BestMatch ? ordering : undefined,
    filter_order:
      filterOrder && filterOrder.length > 0 ? filterOrder.join(',') : undefined,
    ...filters,
  };

  return push({
    search: `${getQueryString(urlParams)}`,
  });
};

const ACCESSION_CODE_REGEX = /^(GSE|ERP|SRP)(\d{3,6}$)|(E-[A-Z]{4}-\d{2,4}$)/i;

/**
 * Returns an array with all the accession codes in the search query (if any)
 * @param {string} query search query
 */
export function getAccessionCodes(query) {
  if (!query) return [];
  const accessionCodes = query.split(/,| /i);
  return accessionCodes.filter(code => ACCESSION_CODE_REGEX.test(code));
}

export function fetchResults({
  query,
  page = 1,
  size = 10,
  ordering = Ordering.BestMatch,
  filterOrder = [],
  filters: appliedFilters,
}) {
  return async (dispatch, getState) => {
    try {
      const apiResults = await Ajax.get('/search/', {
        ...(query ? { search: query } : {}),
        limit: size,
        offset: (page - 1) * size,
        ordering: ordering || Ordering.BestMatch,
        ...appliedFilters,
        // ?empty=true only exists in the FE to signal that we should display experiments
        // with no downloadable samples. When the parameter is not present we query the API
        // with `num_downloadable_samples__gt: 0`
        ...(!appliedFilters || !appliedFilters['empty']
          ? { num_downloadable_samples__gt: 0 }
          : { include_empty: undefined }),
      });
      let { results } = apiResults;
      const { count: totalResults, facets } = apiResults;

      const accessionCodes = getAccessionCodes(query);

      // do accession code search
      if (accessionCodes.length > 0 && page === 1) {
        // each accession code requires an specific query to fetch the exact experiment
        const promises = await Promise.all(
          accessionCodes.map(code =>
            Ajax.get('/search/', {
              search: `accession_code:${code}`,
            })
          )
        );
        const topResults = []
          .concat(...promises.map(data => data.results))
          .map(result => ({
            ...result,
            // this is a hack to mark the results that should be displayed in the top region
            // these are usually from accession code search
            _isTopResult: true,
          }));

        // since we made multiple queries to the server, make sure that there are
        // no repeated experiments.
        results = uniqBy([...topResults, ...results], x => x.accession_code);
      }

      let filters = {
        ...facets,
        organism: facets.organism_names,
        platform: facets.platform_accession_codes,
      };

      if (filterOrder.length > 0) {
        // merge both filter objects to enable interactive filtering
        const lastFilterName = filterOrder[filterOrder.length - 1];
        let previousFilters = getState().search.filters;

        if (!previousFilters) {
          // make another request to the api to fetch the results
          const { facets: previousFacets } = await Ajax.get('/search/', {
            ...(query ? { search: query } : {}),
            limit: 1,
            ...{
              ...appliedFilters,
              [lastFilterName]: undefined,
            },
          });
          previousFilters = previousFacets;
        }

        filters = {
          ...filters,
          // on the last filter category, use the numbers from the previous set
          // to enable interactive filtering
          [lastFilterName]: previousFilters[lastFilterName],
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
          appliedFilters,
        },
      });
    } catch (error) {
      dispatch(reportError(error));
      // rethrow the error
      throw error;
    }
  };
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
      ordering: Ordering.BestMatch,
    })
  );
};

/**
 * Toggles a given filter
 * @param {string} filterType Name of the filter to be applied
 * @param {string} filterValue Value of the filter
 * @param {boolean} trackOrder Allow disabling interactive filtering (used on mobile devices)
 */
export function toggleFilter(filterType, filterValue, trackOrder = true) {
  return (dispatch, getState) => {
    const { filters, filterOrder } = getUrlParams(getState());
    const newFilters = toggleFilterHelper(filters, filterType, filterValue);
    const newFilterOrder = trackOrder
      ? updateFilterOrderHelper({
          filters,
          type: filterType,
          value: filterValue,
          filterOrder,
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
      filterOrder,
      filters: newFilters,
    })
  );
};

export const clearFilters = () => dispatch => {
  const newFilters = {};
  dispatch(updateFilters(newFilters));
};

export const updateOrdering = newOrdering => (dispatch, getState) => {
  const params = getUrlParams(getState());
  // reset to the first page when a filter is applied
  dispatch(
    navigateToResults({
      ...params,
      page: 1,
      ordering: newOrdering,
    })
  );
};

export const updatePage = page => async (dispatch, getState) => {
  const params = getUrlParams(getState());
  dispatch(
    navigateToResults({
      ...params,
      page,
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
      size: resultsPerPage,
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
    [type]: appliedFilterType,
  };

  return newFilters;
}

export function updateFilterOrderHelper({
  filters,
  type,
  value,
  filterOrder = [],
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
