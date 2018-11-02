import React from 'react';
import RefineTable from '../../components/RefineTable';
import 'react-table/react-table.css';

import Pagination from '../../components/Pagination';
import Dropdown from '../../components/Dropdown';
import { getAllDetailedSamples } from '../../api/samples';

import InfoIcon from '../../common/icons/info-badge.svg';

import { PAGE_SIZES } from '../../constants/table';
import SampleFieldMetadata from './SampleFieldMetadata';
import ProcessingInformationCell from './ProcessingInformationCell';
import DataSetSampleActions from './DataSetSampleActions';
import './SamplesTable.scss';
import HorizontalScroll from '../../components/HorizontalScroll';
import isEqual from 'lodash/isEqual';

import uniq from 'lodash/uniq';
import union from 'lodash/union';
import MetadataAnnotationsCell from './MetadataAnnotationsCell';
import { InputClear } from '../../components/Input';
import debounce from 'lodash/debounce';

class SamplesTable extends React.Component {
  state = {
    page: 0,
    pages: -1,
    pageSize: 10,
    columns: this._getColumns(),
    data: [],
    filter: ''
  };

  constructor(props) {
    super(props);

    // create a debounced version of fetch data, to avoid repeating
    this._fetchDataDebounced = debounce(this.fetchData, 400);
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.dataSet, this.props.dataSet)) {
      this.fetchData({ setPage: 0 });
    }
  }

  get totalSamples() {
    return this._getSampleAccessionCodes().length;
  }

  render() {
    const { pageActionComponent } = this.props;
    // `pageActionComponent` is a render prop to add a component at the top right of the table
    // Good for a add/remove samples button. It's a function that receives the currently displayed
    // samples as an argument
    const totalPages = Math.ceil(this.totalSamples / this.state.pageSize);

    // Calculate page size options to exclude ones greater than the number of
    // samples.
    const pageSizes = PAGE_SIZES.filter(size => size <= this.totalSamples);
    if (pageSizes.length === 0) pageSizes.push(this.totalSamples);

    return (
      <RefineTable
        manual={true}
        onFetchData={tableState => this.fetchData({ tableState })}
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
        noDataText={this.props.noDataText}
      >
        {(state, makeTable, instance) => {
          return (
            <div className="samples-table-layout">
              <div className="samples-table-layout__header">
                <div className="experiment__sample-commands">
                  <div className="experiment__per-page-dropdown">
                    Show{' '}
                    <Dropdown
                      options={pageSizes}
                      selectedOption={this.state.pageSize}
                      onChange={this.handlePageSizeChange}
                    />{' '}
                    of {this.totalSamples} Samples
                  </div>
                  {pageActionComponent &&
                    pageActionComponent(state.pageRows.map(x => x._original))}
                </div>
                <div className="samples-table__filter">
                  <div>Filter</div>
                  <div className="samples-table__filter-input">
                    <InputClear
                      value={this.state.filter}
                      onChange={this.handleFilterChange}
                    />
                  </div>
                </div>
              </div>
              <div className="samples-table-layout__main">
                <HorizontalScroll targetSelector=".rt-table">
                  {makeTable()}
                </HorizontalScroll>
              </div>
              <div className="samples-table-layout__footer">
                <div className="samples-table__notice info">
                  <img className="info__icon" src={InfoIcon} alt="" />
                  <div>
                    Some fields may be harmonized.{' '}
                    <a
                      href="http://docs.refine.bio/en/latest/main_text.html#refine-bio-harmonized-metadata"
                      target="_blank"
                      className="link"
                      rel="noopener noreferrer"
                    >
                      Learn more
                    </a>
                  </div>
                </div>

                <Pagination
                  onPaginate={this.handlePagination}
                  totalPages={totalPages}
                  currentPage={this.state.page + 1}
                />
              </div>
            </div>
          );
        }}
      </RefineTable>
    );
  }

  _getSampleAccessionCodes() {
    return uniq(union(...Object.values(this.props.dataSet)));
  }

  fetchData = async ({ tableState = false, setPage = undefined } = {}) => {
    const accessionCodes = this._getSampleAccessionCodes();
    let { page, pageSize } = this.state;
    // get the backend ready `order_by` param, based on the sort options from the table
    let orderBy = this._getSortParam(tableState);

    if (setPage >= 0) {
      page = setPage;
    }

    this.setState({ loading: true, orderBy });

    let offset = page * pageSize;

    let data = await getAllDetailedSamples({
      accessionCodes,
      orderBy,
      offset,
      limit: pageSize,
      filterBy: this.state.filter
    });

    // add a new property to all samples, with the experiment accession codes that reference it in
    // the dataset slice. This is needed when adding/removing the sample from the dataset
    data = data.map(sample => ({
      ...sample,
      experimentAccessionCodes: Object.keys(this.props.dataSet).filter(
        experimentAccessionCode =>
          this.props.dataSet[experimentAccessionCode].includes(
            sample.accession_code
          )
      )
    }));

    // Customize the columns and their order depending on de data
    let columns = this._getColumns(data);

    this.setState({
      data,
      page,
      columns,
      pages: Math.ceil(this.totalSamples / pageSize),
      loading: false
    });
  };

  handleFilterChange = filter => {
    this.setState({ filter }, () => this._fetchDataDebounced());
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
      ),
      Cell: CustomCell
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
        Cell: ProcessingInformationCell,
        width: 200
      },
      {
        Header: 'Additional Metadata',
        id: 'additional_metadata',
        sortable: false,
        Cell: MetadataAnnotationsCell,
        width: 200
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
          className: 'samples-table__add-remove'
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
export default SamplesTable;

/**
 * Custom cell component used to display N/A when there's no value
 */
function CustomCell({ value }) {
  if (!value) {
    return <div className="experiment__not-provided">NA</div>;
  }

  return value;
}

/**
 * Component used for the cells of the header in the SamplesTable
 * Used the default value as guide here:
 * https://github.com/react-tools/react-table/blob/8f062550aad1377618b30f4a4f129a6b1012acf8/src/defaultProps.js#L199-L212
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
  // retrieve all experiment accession codes referencing this sample
  const { experimentAccessionCodes } = sample;
  // Create a dataset slice, where we include all experiments that are referencing this sample
  // that way when it gets added/removed it will impact all those experiments
  const dataSetSlice = experimentAccessionCodes.reduce(
    (result, accessionCode) => {
      result[accessionCode] = [sample.accession_code];
      return result;
    },
    {}
  );

  if (!sample.is_processed) {
    return (
      <div className="sample-not-processed info">
        <img className="info__icon" src={InfoIcon} alt="" />
        <div>
          <div className="nowrap">Sample not processed</div>
          <a
            href="http://docs.refine.bio/en/latest/faq.html#why-can-t-i-add-certain-samples-to-my-dataset"
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more
          </a>
        </div>
      </div>
    );
  }

  return (
    <DataSetSampleActions
      dataSetSlice={dataSetSlice}
      meta={{ addText: 'Add', buttonStyle: 'secondary' }}
    />
  );
}
