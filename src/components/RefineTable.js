import ReactTable from 'react-table';

/**
 * Overrides ReactTable with changes specific to Refinebio
 */
export default class RefineTable extends ReactTable {
  /**
   * When the sort algorithm is modified in the `onSortedChange` callback, two requests are made
   * to the server to fetch results.
   * https://github.com/react-tools/react-table/issues/1099
   * Overriding this method we achieve the same behavior:
   * - disabling multisorting
   * - add a 3rd state to the sorting: ascending, descending, deactivated
   *
   * Original method: https://github.com/react-tools/react-table/blob/06648b257714806888c65bc4aca8d1b295859e26/src/methods.js#L458-L559
   */
  sortColumn(column) {
    const { sorted, defaultSortDesc, skipNextSort } = this.getResolvedState();

    if (skipNextSort) {
      this.setStateWithData({
        skipNextSort: false,
      });
      return;
    }

    const firstSortDirection = defaultSortDesc;
    const secondSortDirection = !firstSortDirection;

    const { onSortedChange } = this.props;

    let newSorted = [];
    // check if we're sorting by a column,
    if (sorted.length > 0 && sorted[0].id === column.id) {
      if (sorted[0].desc === firstSortDirection) {
        newSorted = [{ id: column.id, desc: secondSortDirection }];
      } else if (sorted[0].desc === secondSortDirection) {
        // return to the default state
        newSorted = [];
      }
    } else {
      // if it's a different column then sort by that one
      newSorted = [{ id: column.id, desc: firstSortDirection }];
    }

    this.setStateWithData(
      {
        page: !sorted.length && newSorted.length ? 0 : this.state.page,
        sorted: newSorted,
      },
      () => onSortedChange && onSortedChange(newSorted, column)
    );
  }
}
