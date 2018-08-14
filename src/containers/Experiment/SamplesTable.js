import React from 'react';
import { connect } from 'react-redux';
import Button from '../../components/Button';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import Pagination from '../../components/Pagination';
import Dropdown from '../../components/Dropdown';
import { getAllDetailedSamples } from '../../api/samples';
import ModalManager from '../../components/Modal/ModalManager';

import { PAGE_SIZES } from '../../constants/table';
import SampleFieldMetadata from './SampleFieldMetadata';
import {
  RemoveFromDatasetButton,
  AddToDatasetButton
} from '../../containers/Results/Result';
import {
  addExperiment,
  removeExperiment,
  removeSamplesFromExperiment
} from '../../state/download/actions';
import ProcessingInformationCell from './ProcessingInformationCell';

import './SamplesTable.scss';

class SamplesTable extends React.Component {
  componentDidMount() {
    document
      .querySelector('.samples-table__scroll-right')
      .addEventListener('click', this.scrollRight);

    document
      .querySelector('.samples-table__scroll-left')
      .addEventListener('click', this.scrollLeft);

    document
      .querySelector('.rt-table')
      .addEventListener('scroll', this.disableScrollButtonsIfNecessary);

    // This is apparently the idiomatic way to trigger a callback if a specific attribute changed.
    // This detects resizing on the react-table because while the table is resizing the inline
    // style for max-width changes on '.rt-thead'.
    this.state.resizeObserver = new MutationObserver(
      this.disableScrollButtonsIfNecessary
    );
    this.state.resizeObserver.observe(document.querySelector('.rt-thead'), {
      attributes: true,
      attributeFilter: ['style']
    });
  }

  componentDidUpdate() {
    this.disableScrollButtonsIfNecessary();
  }

  getMaxScrollPosition = () => {
    const element = document.querySelector('.rt-table');
    return element.scrollWidth - element.clientWidth;
  };

  disableScrollButtonsIfNecessary = () => {
    const element = document.querySelector('.rt-table');
    if (element.scrollLeft <= 0) {
      document
        .querySelector('.samples-table__scroll-left')
        .classList.add('samples-table__scroll--disabled');
    } else {
      document
        .querySelector('.samples-table__scroll-left')
        .classList.remove('samples-table__scroll--disabled');
    }

    if (element.scrollLeft >= this.getMaxScrollPosition()) {
      document
        .querySelector('.samples-table__scroll-right')
        .classList.add('samples-table__scroll--disabled');
    } else {
      document
        .querySelector('.samples-table__scroll-right')
        .classList.remove('samples-table__scroll--disabled');
    }
  };

  scrollLeft = () => {
    document.querySelector('.rt-table').scrollBy({
      top: 0,
      left: -100,
      behavior: 'smooth'
    });
  };

  scrollRight = () => {
    document.querySelector('.rt-table').scrollBy({
      top: 0,
      left: 100,
      behavior: 'smooth'
    });
  };

  state = {
    page: 0,
    pages: -1,
    pageSize: 10,
    columns: this._getColumns(),
    data: []
  };

  get totalSamples() {
    return this.props.accessionCodes.length;
  }

  removeRow = rowId => {
    const arrayCopy = this.state.data.filter(row => row.id !== rowId);
    this.setState({ data: arrayCopy });
  };

  render() {
    const { pageActionComponent } = this.props;
    // `pageActionComponent` is a render prop to add a component at the top right of the table
    // Good for a add/remove samples button. It's a function that receives the currently displayed
    // samples as an argument
    const totalPages = Math.ceil(this.totalSamples / this.state.pageSize);

    // Calculate page size options to exclude ones greater than the number of
    // samples.
    const pageSizes = PAGE_SIZES.filter(size => size <= this.totalSamples);
    if (pageSizes.length == 0) pageSizes.push(this.totalSamples);

    // TODO: remove this call https://github.com/AlexsLemonade/refinebio-frontend/issues/239
    if (this.state.mounted) {
      this.disableScrollButtonsIfNecessary();
    }

    return (
      <ReactTable
        manual={true}
        onFetchData={this.fetchData}
        loading={this.state.loading}
        pages={this.state.pages}
        data={this.state.data}
        page={this.state.page}
        pageSize={this.state.pageSize}
        className="samples-table"
        showPageSizeOptions={false}
        showPagination={false}
        columns={this.state.columns}
        ThComponent={ThComponent}
        minRows={0}
      >
        {(state, makeTable, instance) => {
          return (
            <div>
              <div className="experiment__sample-commands">
                <div className="experiment__per-page-dropdown">
                  Show
                  <Dropdown
                    options={pageSizes}
                    selectedOption={this.state.pageSize}
                    onChange={this.handlePageSizeChange}
                  />
                  of {this.totalSamples} Samples
                </div>
                {pageActionComponent &&
                  pageActionComponent(state.pageRows.map(x => x._original))}
              </div>
              <div className="experiment__table-container">
                <div className="samples-table__scroll-left">
                  <div className="samples-table__scroll-button">{'<'}</div>
                </div>
                {makeTable()}
                <div className="samples-table__scroll-right">
                  <div className="samples-table__scroll-button">{'>'}</div>
                </div>
              </div>
              <Pagination
                onPaginate={this.handlePagination}
                totalPages={totalPages}
                currentPage={this.state.page + 1}
              />
            </div>
          );
        }}
      </ReactTable>
    );
  }

  fetchData = async (tableState = false) => {
    const { accessionCodes, experimentAccessionCodes = [] } = this.props;
    const { page, pageSize } = this.state;
    // get the backend ready `order_by` param, based on the sort options from the table
    let orderBy = this._getSortParam(tableState);

    this.setState({ loading: true, orderBy });

    let offset = page * pageSize;

    let data = await getAllDetailedSamples({
      accessionCodes,
      orderBy,
      offset,
      limit: pageSize
    });

    if (experimentAccessionCodes.length === 1) {
      const experimentAccessionCode = experimentAccessionCodes[0];

      data = data.map(sample => {
        return { ...sample, experimentAccessionCode };
      });
    } else if (experimentAccessionCodes.length > 1) {
      data = data.map(sample => {
        const experimentAccessionCode =
          experimentAccessionCodes[
            accessionCodes.indexOf(sample.accession_code)
          ];
        return { ...sample, experimentAccessionCode };
      });
    }

    // Customize the columns and their order depending on de data
    let columns = this._getColumns(data);

    this.setState({
      data,
      columns,
      pages: Math.ceil(this.totalSamples / pageSize),
      loading: false
    });
  };

  handlePagination = page => {
    // Set the current page, and update the data afterwards
    this.setState({ page: page - 1 }, () => this.fetchData());
  };

  handlePageSizeChange = pageSize => {
    let page = this.state.page;
    // check if the page is outside of the new page range
    if ((page + 1) * pageSize > this.totalSamples) {
      // set the page to the last one
      page = Math.floor(this.totalSamples / pageSize);
    }

    this.setState({ page, pageSize }, () => this.fetchData());
  };

  /**
   * Returns a custom column specification depending on the data passed.
   * - Empty Columns are hidden
   * - Columns with more values have higher priority
   * @param {Array} data Data that should be displayed in the table
   */
  _getColumns(data = []) {
    const isImmutable = this.props.isImmutable;
    // 1. define all columns
    // 2. count the number of samples that have a value for each column
    let columns = SampleFieldMetadata.map(column => ({
      ...column,
      __totalValues: data.reduce(
        (total, sample) => total + (!!column.accessor(sample) ? 1 : 0),
        0
      )
    }));

    columns = columns.sort(
      (column1, column2) => column2.__totalValues - column1.__totalValues - 1
    );

    // 3. Filter out the columns that don't have a value
    columns = columns.filter(column => column.__totalValues > 0);

    // Get the headers that do not depend on isImmutable first
    let headers = [
      {
        id: 'id',
        accessor: d => d.id,
        show: false
      },
      ...columns,
      {
        Header: 'Processing Information',
        id: 'processing_information',
        sortable: false,
        Cell: ProcessingInformationCell
      }
    ];

    // In some instances like the DataSet page we want to hide the Add/Remove
    // buttons, but otherwise the Add/Remove column should be the first one.
    // If the list is not immutable, prepend the Add/Remove column to headers
    if (!isImmutable) {
      headers = [
        {
          Header: 'Add/Remove',
          id: 'add_remove',
          sortable: false,
          Cell: AddRemoveCell.bind(this),
          width: 190,
          className: 'samples-table__add-remove',
          show: !!this.props.experimentAccessionCodes.length
        },
        ...headers
      ];
    }

    // Return the final list of columns
    return headers;
  }

  /**
   * Returns the sort parameter as required from the backend
   * @param {*} tableState State from the table, as given to `fetchData`
   */
  _getSortParam(tableState) {
    let orderBy = undefined;
    if (tableState) {
      const { sorted } = tableState;
      // check table sort
      if (sorted && sorted.length > 0) {
        // we don't support sorting by multiple columns, so only consider the first one
        const { id, desc } = sorted[0];
        // ref: https://github.com/AlexsLemonade/refinebio/pull/298
        orderBy = `${desc ? '-' : ''}${id}`;
      } else {
        orderBy = undefined;
      }
    } else {
      orderBy = this.state.orderBy;
    }
    return orderBy;
  }
}

/**
 * Component used for the cells of the header in the SamplesTable
 * Used the default value as guide here https://github.com/react-tools/react-table/blob/8f062550aad1377618b30f4a4f129a6b1012acf8/src/defaultProps.js#L199-L212
 */
function ThComponent({ toggleSort, className, children, ...rest }) {
  return (
    <div
      className={`rt-th ${className} samples-table__th`}
      onClick={e => toggleSort && toggleSort(e)}
      role="columnheader"
      {...rest}
    >
      {children}

      <div className="samples-table__sort">
        <i className="ion-chevron-up samples-table__sort-icon" />
        <i className="ion-chevron-down samples-table__sort-icon" />
      </div>

      <div className="samples-table__sort-desc">
        <i className="ion-chevron-down samples-table__sort-icon" />
      </div>

      <div className="samples-table__sort-asc">
        <i className="ion-chevron-up samples-table__sort-icon" />
      </div>
    </div>
  );
}

function AddRemoveCell({ original: sample, row: { id: rowId } }) {
  const { experimentAccessionCode, accession_code } = sample;
  const { removeRow } = this;
  const {
    addExperiment,
    removeSamplesFromExperiment,
    dataSet,
    isRowRemovable = false,
    isImmutable = false
  } = this.props;
  const isAdded =
    dataSet[experimentAccessionCode] &&
    dataSet[experimentAccessionCode].includes(accession_code);

  if (!sample.is_processed) {
    return <p className="dataset-add-button__info-text">
        <i className="ion-information-circled dataset-add-button__info-icon" />{' '}
        Sample not processed <a href="#" className="button--link">Learn More</a>
      </p>;
  } else if (!isAdded) {
    return (
      <AddToDatasetButton
        addMessage={'Add'}
        handleAdd={() =>
          addExperiment([
            {
              accession_code: experimentAccessionCode,
              samples: [accession_code]
            }
          ])
        }
        buttonStyle={'secondary'}
      />
    );
  }

  return (
    <RemoveFromDatasetButton
      handleRemove={() => {
        if (isRowRemovable) removeRow(rowId);
        removeSamplesFromExperiment(experimentAccessionCode, [accession_code]);
      }}
      remove={!this.props.isImmutable}
    />
  );
}

export default (SamplesTable = connect(
  ({ download: { dataSet } }) => ({
    dataSet
  }),
  {
    addExperiment,
    removeSamplesFromExperiment
  }
)(SamplesTable));
